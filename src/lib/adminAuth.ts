/**
 * Bloom Café Admin Authentication & Cryptographic Security Module
 * 
 * Provides client-side salted SHA-256 hashing via Web Crypto API,
 * strong username & password policy enforcement, brute-force rate-limiting & lockout,
 * session auto-lock/inactivity timeouts, and emergency master recovery keys.
 */

export interface PasswordStrengthResult {
  score: number; // 0 (Very Weak) to 4 (Very Strong)
  label: "Very Weak" | "Weak" | "Fair" | "Strong" | "Very Strong";
  color: string;
  percentage: number;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
  feedback: string[];
}

export interface AdminSecurityConfig {
  username: string; // e.g. "bloom_admin"
  salt: string;
  passwordHash: string;
  recoveryKey: string;
  sessionTimeoutMinutes: number; // 15, 30, 60, 240
  failedAttempts: number;
  lockoutUntil: number | null; // Unix timestamp in ms
  lastLoginTime: string | null;
  lastPasswordChange: string | null;
  lastUsernameChange: string | null;
}

export interface AdminSessionToken {
  authenticated: boolean;
  username: string;
  loginTime: number;
  lastActivityTime: number;
  sessionExpiryMinutes: number;
}

const STORAGE_CONFIG_KEY = "bloom_admin_sec_config_v2";
const SESSION_TOKEN_KEY = "bloom_admin_session_token";

export const DEFAULT_MASTER_USERNAME = "bloom_admin";
export const DEFAULT_MASTER_PASSWORD = "BloomCafe@2025!";
const DEFAULT_SALT = "b100m_c4f3_s3cur3_s4lt_99";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

/**
 * Converts ArrayBuffer to Hex string
 */
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Generate a random cryptographic hex salt
 */
export function generateRandomSalt(length: number = 16): string {
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return bufferToHex(array.buffer);
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Generates an emergency recovery key formatted as BLOOM-SEC-XXXX-XXXX
 */
export function generateRecoveryKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let part1 = "";
  let part2 = "";
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BLOOM-SEC-${part1}-${part2}`;
}

/**
 * Computes a salted SHA-256 hash using the native Web Crypto API
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}:bloom_admin_guard`);
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    return bufferToHex(hashBuffer);
  }
  // Fallback simple hash for non-crypto environments
  let hash = 0;
  const str = `${salt}:${password}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return "fallback_" + Math.abs(hash).toString(16);
}

/**
 * Validates username criteria (4-30 chars, alphanumeric + underscores/dashes)
 */
export function validateUsername(username: string): { isValid: boolean; error?: string } {
  const trimmed = username.trim();
  if (trimmed.length < 4) {
    return { isValid: false, error: "Username must be at least 4 characters long." };
  }
  if (trimmed.length > 30) {
    return { isValid: false, error: "Username cannot exceed 30 characters." };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return { isValid: false, error: "Username may only contain letters, numbers, underscores (_), and hyphens (-)." };
  }
  return { isValid: true };
}

/**
 * Evaluates password strength against strict security policies
 */
export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password);

  const passedChecks = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
  ].filter(Boolean).length;

  let score = 0;
  let label: PasswordStrengthResult["label"] = "Very Weak";
  let color = "bg-rose-500 text-rose-500";
  let percentage = 15;

  if (password.length === 0) {
    score = 0;
    label = "Very Weak";
    color = "bg-gray-300 text-gray-500";
    percentage = 0;
  } else if (passedChecks <= 2) {
    score = 1;
    label = "Weak";
    color = "bg-rose-500 text-rose-500";
    percentage = 25;
  } else if (passedChecks === 3 || (passedChecks === 4 && password.length < 8)) {
    score = 2;
    label = "Fair";
    color = "bg-amber-500 text-amber-500";
    percentage = 50;
  } else if (passedChecks === 4 && hasMinLength) {
    score = 3;
    label = "Strong";
    color = "bg-emerald-500 text-emerald-500";
    percentage = 80;
  } else if (passedChecks === 5 && password.length >= 10) {
    score = 4;
    label = "Very Strong";
    color = "bg-[#2C3E2E] text-[#2C3E2E]";
    percentage = 100;
  } else if (passedChecks === 5) {
    score = 3;
    label = "Strong";
    color = "bg-emerald-500 text-emerald-500";
    percentage = 85;
  }

  const feedback: string[] = [];
  if (!hasMinLength) feedback.push("Minimum 8 characters (10+ recommended)");
  if (!hasUppercase) feedback.push("At least one uppercase letter (A-Z)");
  if (!hasLowercase) feedback.push("At least one lowercase letter (a-z)");
  if (!hasNumber) feedback.push("At least one number (0-9)");
  if (!hasSpecialChar) feedback.push("At least one special character (!@#$%^&*)");

  // Valid if minimum length + at least 3 other rules
  const isValid = hasMinLength && passedChecks >= 4;

  return {
    score,
    label,
    color,
    percentage,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    isValid,
    feedback,
  };
}

/**
 * Initializes or loads the stored security configuration
 */
export async function getAdminSecurityConfig(): Promise<AdminSecurityConfig> {
  if (typeof window === "undefined") {
    const defaultHash = await hashPassword(DEFAULT_MASTER_PASSWORD, DEFAULT_SALT);
    return {
      username: DEFAULT_MASTER_USERNAME,
      salt: DEFAULT_SALT,
      passwordHash: defaultHash,
      recoveryKey: "BLOOM-SEC-DEMO-9900",
      sessionTimeoutMinutes: 30,
      failedAttempts: 0,
      lockoutUntil: null,
      lastLoginTime: null,
      lastPasswordChange: new Date().toISOString(),
      lastUsernameChange: new Date().toISOString(),
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (stored) {
      const parsed: AdminSecurityConfig = JSON.parse(stored);
      if (!parsed.username) {
        parsed.username = DEFAULT_MASTER_USERNAME;
        saveAdminSecurityConfig(parsed);
      }
      return parsed;
    }
  } catch (err) {
    console.error("Failed to parse security config:", err);
  }

  // Initialize with strong default username and password
  const salt = generateRandomSalt(16);
  const passwordHash = await hashPassword(DEFAULT_MASTER_PASSWORD, salt);
  const recoveryKey = generateRecoveryKey();

  const initialConfig: AdminSecurityConfig = {
    username: DEFAULT_MASTER_USERNAME,
    salt,
    passwordHash,
    recoveryKey,
    sessionTimeoutMinutes: 30,
    failedAttempts: 0,
    lockoutUntil: null,
    lastLoginTime: null,
    lastPasswordChange: new Date().toISOString(),
    lastUsernameChange: new Date().toISOString(),
  };

  saveAdminSecurityConfig(initialConfig);
  return initialConfig;
}

/**
 * Saves security configuration to localStorage
 */
export function saveAdminSecurityConfig(config: AdminSecurityConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error("Failed to save security config:", err);
  }
}

/**
 * Checks if the user is currently locked out due to brute force attempts
 */
export async function getLockoutStatus(): Promise<{
  isLockedOut: boolean;
  remainingSeconds: number;
  failedAttempts: number;
  maxAttempts: number;
}> {
  const config = await getAdminSecurityConfig();
  const now = Date.now();

  if (config.lockoutUntil && config.lockoutUntil > now) {
    const remainingSeconds = Math.ceil((config.lockoutUntil - now) / 1000);
    return {
      isLockedOut: true,
      remainingSeconds,
      failedAttempts: config.failedAttempts,
      maxAttempts: MAX_FAILED_ATTEMPTS,
    };
  }

  // Lockout expired, reset lockout timestamp if needed
  if (config.lockoutUntil && config.lockoutUntil <= now) {
    config.lockoutUntil = null;
    config.failedAttempts = 0;
    saveAdminSecurityConfig(config);
  }

  return {
    isLockedOut: false,
    remainingSeconds: 0,
    failedAttempts: config.failedAttempts,
    maxAttempts: MAX_FAILED_ATTEMPTS,
  };
}

/**
 * Authenticates the admin with both username and password
 */
export async function authenticateAdmin(
  username: string,
  password: string
): Promise<{
  success: boolean;
  error?: string;
  isLockedOut?: boolean;
  remainingSeconds?: number;
  attemptsRemaining?: number;
}> {
  const config = await getAdminSecurityConfig();
  const now = Date.now();

  // Check lockout
  if (config.lockoutUntil && config.lockoutUntil > now) {
    const remainingSeconds = Math.ceil((config.lockoutUntil - now) / 1000);
    return {
      success: false,
      isLockedOut: true,
      remainingSeconds,
      error: `Security Lockout active. Please wait ${remainingSeconds} seconds.`,
    };
  }

  // Check username match (case-insensitive) and compute salted password hash
  const cleanUsername = username.trim().toLowerCase();
  const targetUsername = config.username.trim().toLowerCase();
  const computedHash = await hashPassword(password, config.salt);

  const isUsernameMatch = cleanUsername === targetUsername;
  const isPasswordMatch = computedHash === config.passwordHash;

  if (isUsernameMatch && isPasswordMatch) {
    // Successful login: reset failed attempts
    config.failedAttempts = 0;
    config.lockoutUntil = null;
    config.lastLoginTime = new Date().toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
    saveAdminSecurityConfig(config);

    // Create session token
    createAdminSession(config.username, config.sessionTimeoutMinutes);

    return { success: true };
  }

  // Failed login: increment failed attempts
  config.failedAttempts = (config.failedAttempts || 0) + 1;

  if (config.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    config.lockoutUntil = now + LOCKOUT_DURATION_MS;
    saveAdminSecurityConfig(config);
    return {
      success: false,
      isLockedOut: true,
      remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
      error: `Too many failed attempts. Security lockout triggered for 60 seconds.`,
    };
  }

  saveAdminSecurityConfig(config);
  const attemptsRemaining = MAX_FAILED_ATTEMPTS - config.failedAttempts;

  return {
    success: false,
    attemptsRemaining,
    error: `Invalid administrator username or password. ${attemptsRemaining} ${
      attemptsRemaining === 1 ? "attempt" : "attempts"
    } remaining before temporary lockout.`,
  };
}

/**
 * Creates an authenticated session in sessionStorage
 */
export function createAdminSession(
  username: string,
  sessionExpiryMinutes: number = 30
): void {
  if (typeof window === "undefined") return;
  const now = Date.now();
  const sessionToken: AdminSessionToken = {
    authenticated: true,
    username,
    loginTime: now,
    lastActivityTime: now,
    sessionExpiryMinutes,
  };
  sessionStorage.setItem(SESSION_TOKEN_KEY, JSON.stringify(sessionToken));
}

/**
 * Checks if current session is active and not expired
 */
export function verifyAdminSession(): {
  isValid: boolean;
  username?: string;
  reason?: "no_session" | "expired" | "invalid";
} {
  if (typeof window === "undefined") return { isValid: false, reason: "no_session" };

  try {
    const raw = sessionStorage.getItem(SESSION_TOKEN_KEY);
    if (!raw) return { isValid: false, reason: "no_session" };

    const token: AdminSessionToken = JSON.parse(raw);
    if (!token.authenticated) return { isValid: false, reason: "invalid" };

    // Check timeout if configured (minutes > 0)
    if (token.sessionExpiryMinutes > 0) {
      const maxAgeMs = token.sessionExpiryMinutes * 60 * 1000;
      const now = Date.now();
      if (now - token.lastActivityTime > maxAgeMs) {
        destroyAdminSession();
        return { isValid: false, reason: "expired" };
      }
    }

    // Refresh last activity time
    token.lastActivityTime = Date.now();
    sessionStorage.setItem(SESSION_TOKEN_KEY, JSON.stringify(token));

    return { isValid: true, username: token.username };
  } catch {
    return { isValid: false, reason: "invalid" };
  }
}

/**
 * Clears the admin session
 */
export function destroyAdminSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
  sessionStorage.removeItem("bloom_admin_auth");
}

/**
 * Updates the admin username
 */
export async function updateAdminUsername(
  currentPassword: string,
  newUsername: string
): Promise<{ success: boolean; error?: string }> {
  const config = await getAdminSecurityConfig();

  // Verify current password
  const currentHash = await hashPassword(currentPassword, config.salt);
  if (currentHash !== config.passwordHash) {
    return { success: false, error: "Current password verification failed." };
  }

  // Validate new username
  const check = validateUsername(newUsername);
  if (!check.isValid) {
    return { success: false, error: check.error };
  }

  config.username = newUsername.trim();
  config.lastUsernameChange = new Date().toISOString();
  saveAdminSecurityConfig(config);

  return { success: true };
}

/**
 * Changes the admin password
 */
export async function updateAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const config = await getAdminSecurityConfig();

  // Verify current password
  const currentHash = await hashPassword(currentPassword, config.salt);
  if (currentHash !== config.passwordHash) {
    return { success: false, error: "Current password does not match." };
  }

  // Validate new password strength
  const strength = evaluatePasswordStrength(newPassword);
  if (!strength.isValid) {
    return {
      success: false,
      error: `Password is not strong enough. ${strength.feedback.join(", ")}`,
    };
  }

  // Generate fresh salt and update hash
  const newSalt = generateRandomSalt(16);
  const newHash = await hashPassword(newPassword, newSalt);

  config.salt = newSalt;
  config.passwordHash = newHash;
  config.lastPasswordChange = new Date().toISOString();
  config.failedAttempts = 0;
  config.lockoutUntil = null;

  saveAdminSecurityConfig(config);

  return { success: true };
}

/**
 * Recovers access using Master Recovery Key and sets new credentials
 */
export async function recoverWithRecoveryKey(
  recoveryKey: string,
  newUsername: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const config = await getAdminSecurityConfig();

  const cleanedKey = recoveryKey.trim().toUpperCase();
  if (cleanedKey !== config.recoveryKey.toUpperCase()) {
    return { success: false, error: "Invalid Emergency Recovery Key." };
  }

  // Validate username
  const usernameCheck = validateUsername(newUsername);
  if (!usernameCheck.isValid) {
    return { success: false, error: usernameCheck.error };
  }

  // Validate new password
  const strength = evaluatePasswordStrength(newPassword);
  if (!strength.isValid) {
    return {
      success: false,
      error: `New password does not meet security requirements. ${strength.feedback.join(", ")}`,
    };
  }

  // Update credentials & generate new recovery key for security
  const newSalt = generateRandomSalt(16);
  const newHash = await hashPassword(newPassword, newSalt);
  const freshRecoveryKey = generateRecoveryKey();

  config.username = newUsername.trim();
  config.salt = newSalt;
  config.passwordHash = newHash;
  config.recoveryKey = freshRecoveryKey;
  config.failedAttempts = 0;
  config.lockoutUntil = null;
  config.lastPasswordChange = new Date().toISOString();
  config.lastUsernameChange = new Date().toISOString();

  saveAdminSecurityConfig(config);

  return { success: true };
}

/**
 * Regenerates the emergency recovery key
 */
export async function regenerateAdminRecoveryKey(): Promise<string> {
  const config = await getAdminSecurityConfig();
  const newKey = generateRecoveryKey();
  config.recoveryKey = newKey;
  saveAdminSecurityConfig(config);
  return newKey;
}

/**
 * Updates session timeout duration
 */
export async function updateAdminSessionTimeout(minutes: number): Promise<void> {
  const config = await getAdminSecurityConfig();
  config.sessionTimeoutMinutes = minutes;
  saveAdminSecurityConfig(config);

  // Update active session token if any
  if (typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem(SESSION_TOKEN_KEY);
      if (raw) {
        const token: AdminSessionToken = JSON.parse(raw);
        token.sessionExpiryMinutes = minutes;
        token.lastActivityTime = Date.now();
        sessionStorage.setItem(SESSION_TOKEN_KEY, JSON.stringify(token));
      }
    } catch {}
  }
}
