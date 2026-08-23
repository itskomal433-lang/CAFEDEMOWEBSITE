import React, { useState, useEffect } from "react";
import {
  Shield,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  RotateCcw,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  LogOut,
  User,
  UserCheck,
  Edit3,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getAdminSecurityConfig,
  updateAdminPassword,
  updateAdminUsername,
  updateAdminSessionTimeout,
  regenerateAdminRecoveryKey,
  evaluatePasswordStrength,
  validateUsername,
  AdminSecurityConfig,
  destroyAdminSession,
} from "@/lib/adminAuth";

interface AdminSecurityProps {
  onLogout: () => void;
}

export function AdminSecurity({ onLogout }: AdminSecurityProps) {
  const [config, setConfig] = useState<AdminSecurityConfig | null>(null);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Username change state
  const [isChangingUsername, setIsChangingUsername] = useState(false);
  const [newUsernameInput, setNewUsernameInput] = useState("");
  const [usernameVerifyPassword, setUsernameVerifyPassword] = useState("");
  const [showUsernameVerifyPassword, setShowUsernameVerifyPassword] = useState(false);
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

  const [hasCopiedRecovery, setHasCopiedRecovery] = useState(false);
  const [isRegeneratingKey, setIsRegeneratingKey] = useState(false);

  // Load config on mount
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const cfg = await getAdminSecurityConfig();
    setConfig(cfg);
  };

  const passwordStrength = evaluatePasswordStrength(newPassword);
  const usernameCheck = validateUsername(newUsernameInput);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Please enter your current master password.");
      return;
    }

    if (!passwordStrength.isValid) {
      toast.error("New password does not meet security requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await updateAdminPassword(currentPassword, newPassword);
      if (res.success) {
        toast.success("🔐 Admin Master Password successfully updated!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        await loadConfig();
      } else {
        toast.error(res.error || "Failed to update password.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usernameCheck.isValid) {
      toast.error(usernameCheck.error || "Invalid username format.");
      return;
    }

    if (!usernameVerifyPassword) {
      toast.error("Please enter your current master password to confirm.");
      return;
    }

    setIsUpdatingUsername(true);
    try {
      const res = await updateAdminUsername(usernameVerifyPassword, newUsernameInput);
      if (res.success) {
        toast.success(`👤 Administrator username changed to "${newUsernameInput.trim()}"!`);
        setIsChangingUsername(false);
        setNewUsernameInput("");
        setUsernameVerifyPassword("");
        await loadConfig();
      } else {
        toast.error(res.error || "Failed to update username.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const handleTimeoutChange = async (minutes: number) => {
    await updateAdminSessionTimeout(minutes);
    await loadConfig();
    toast.success(`Session auto-lock updated to ${minutes > 0 ? `${minutes} minutes` : "Never"}.`);
  };

  const handleCopyRecoveryKey = () => {
    if (!config?.recoveryKey) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(config.recoveryKey);
      setHasCopiedRecovery(true);
      toast.success("Recovery Key copied to clipboard! Keep this safe.");
      setTimeout(() => setHasCopiedRecovery(false), 2500);
    }
  };

  const handleRegenerateRecoveryKey = async () => {
    if (!confirm("Are you sure you want to regenerate the Emergency Recovery Key? The previous key will no longer work.")) {
      return;
    }
    setIsRegeneratingKey(true);
    try {
      const newKey = await regenerateAdminRecoveryKey();
      await loadConfig();
      toast.success(`New Emergency Recovery Key generated: ${newKey}`);
    } finally {
      setIsRegeneratingKey(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2C3E2E] text-[#FAF6EE]">
            <Shield className="h-4 w-4 text-[#D07A60]" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-[#2C3E2E]">
              Admin Security & Credentials Control
            </h2>
            <p className="text-xs text-[#6D6964]">
              Manage cryptographic administrator username, master password, session auto-lock timeouts, and emergency recovery keys.
            </p>
          </div>
        </div>
      </div>

      {/* Security Status Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-[#E8DFD3] bg-white p-4 shadow-xs flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-[#D07A60] shrink-0">
            <UserCheck className="h-5 w-5" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D6964]">Admin Username</span>
            <div className="font-mono text-xs font-extrabold text-[#2C3E2E] truncate">
              {config?.username || "bloom_admin"}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">Active Identity</span>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E8DFD3] bg-white p-4 shadow-xs flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D6964]">Password Guard</span>
            <div className="font-mono text-xs font-extrabold text-[#2C3E2E]">SHA-256 + Salt</div>
            <span className="text-[10px] text-emerald-600 font-semibold">Web Crypto API</span>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E8DFD3] bg-white p-4 shadow-xs flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D6964]">Inactivity Lock</span>
            <div className="font-sans text-xs font-extrabold text-[#2C3E2E]">
              {config?.sessionTimeoutMinutes ? `${config.sessionTimeoutMinutes} Mins` : "30 Mins"}
            </div>
            <span className="text-[10px] text-blue-600 font-semibold">Auto-Console Lock</span>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E8DFD3] bg-white p-4 shadow-xs flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 shrink-0">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D6964]">Brute-Force Guard</span>
            <div className="font-sans text-xs font-extrabold text-[#2C3E2E]">5 Attempts / 60s</div>
            <span className="text-[10px] text-emerald-600 font-semibold">Lockout Shield</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Username & Password Forms */}
        <div className="lg:col-span-7 space-y-6">

          {/* Card 1: Master Username Control */}
          <div className="rounded-3xl border border-[#E8DFD3] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE0]">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#D07A60]" />
                <h3 className="font-display text-base font-bold text-[#2C3E2E]">
                  Administrator Username
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FAF6EE] text-[#2C3E2E] px-2.5 py-1 rounded-full border border-[#E8DFD3]">
                Identity Guard
              </span>
            </div>

            <div className="flex items-center justify-between bg-[#FAF6EE] border border-[#E8DFD3] rounded-2xl p-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D6964]">
                  Current Master Username
                </span>
                <div className="font-mono text-base font-extrabold text-[#2C3E2E]">
                  {config?.username || "bloom_admin"}
                </div>
              </div>

              {!isChangingUsername && (
                <Button
                  onClick={() => {
                    setIsChangingUsername(true);
                    setNewUsernameInput(config?.username || "");
                  }}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-[#E8DFD3] hover:bg-white text-xs font-bold text-[#2C3E2E] flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5 text-[#D07A60]" />
                  <span>Change Username</span>
                </Button>
              )}
            </div>

            {isChangingUsername && (
              <form onSubmit={handleChangeUsername} className="space-y-3 pt-2 border-t border-[#F0EAE0] animate-in fade-in">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2C3E2E]">
                    New Master Username (4-30 chars):
                  </label>
                  <Input
                    required
                    placeholder="e.g. bloom_lead_barista"
                    value={newUsernameInput}
                    onChange={(e) => setNewUsernameInput(e.target.value)}
                    className="bg-[#FAF6EE] border-[#E8DFD3] text-xs font-mono font-bold"
                  />
                  <p className="text-[10px] text-[#6D6964]">
                    Letters, numbers, underscores (_), and hyphens (-) allowed.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2C3E2E]">
                    Confirm with Current Password:
                  </label>
                  <div className="relative">
                    <Input
                      type={showUsernameVerifyPassword ? "text" : "password"}
                      required
                      placeholder="Enter current password..."
                      value={usernameVerifyPassword}
                      onChange={(e) => setUsernameVerifyPassword(e.target.value)}
                      className="bg-[#FAF6EE] border-[#E8DFD3] pr-10 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowUsernameVerifyPassword(!showUsernameVerifyPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showUsernameVerifyPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    type="submit"
                    disabled={isUpdatingUsername || !usernameCheck.isValid || !usernameVerifyPassword}
                    className="flex-1 rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-white text-xs font-bold py-2 cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingUsername ? "Updating..." : "Save New Username"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsChangingUsername(false);
                      setUsernameVerifyPassword("");
                    }}
                    className="rounded-full text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Card 2: Change Master Password Form */}
          <div className="rounded-3xl border border-[#E8DFD3] bg-white p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE0]">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-[#D07A60]" />
                <h3 className="font-display text-base font-bold text-[#2C3E2E]">
                  Change Admin Master Password
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FAF6EE] text-[#6D6964] px-2.5 py-1 rounded-full border border-[#E8DFD3]">
                Strict Policy
              </span>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2C3E2E]">
                  Current Master Password:
                </label>
                <div className="relative">
                  <Input
                    type={showCurrent ? "text" : "password"}
                    required
                    placeholder="Enter current password..."
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-[#FAF6EE] border-[#E8DFD3] pr-10 text-xs text-[#2C3E2E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2C3E2E]">
                  New Strong Password:
                </label>
                <div className="relative">
                  <Input
                    type={showNew ? "text" : "password"}
                    required
                    placeholder="e.g. Melbourne#Roast2025!"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-[#FAF6EE] border-[#E8DFD3] pr-10 text-xs text-[#2C3E2E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {newPassword.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#6D6964]">Strength:</span>
                      <span className={`font-extrabold ${passwordStrength.color}`}>
                        {passwordStrength.label} ({passwordStrength.percentage}%)
                      </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-[#E8DFD3]/60 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score <= 1
                            ? "bg-rose-500"
                            : passwordStrength.score === 2
                            ? "bg-amber-500"
                            : passwordStrength.score === 3
                            ? "bg-emerald-500"
                            : "bg-[#2C3E2E]"
                        }`}
                        style={{ width: `${passwordStrength.percentage}%` }}
                      />
                    </div>

                    {/* Requirements Checklist */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                      <div className="flex items-center gap-1.5">
                        {passwordStrength.hasMinLength ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-gray-400" />
                        )}
                        <span className={passwordStrength.hasMinLength ? "text-emerald-700 font-semibold" : "text-[#6D6964]"}>
                          8+ Characters
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {passwordStrength.hasUppercase ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-gray-400" />
                        )}
                        <span className={passwordStrength.hasUppercase ? "text-emerald-700 font-semibold" : "text-[#6D6964]"}>
                          Uppercase (A-Z)
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {passwordStrength.hasNumber ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-gray-400" />
                        )}
                        <span className={passwordStrength.hasNumber ? "text-emerald-700 font-semibold" : "text-[#6D6964]"}>
                          Number (0-9)
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {passwordStrength.hasSpecialChar ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-gray-400" />
                        )}
                        <span className={passwordStrength.hasSpecialChar ? "text-emerald-700 font-semibold" : "text-[#6D6964]"}>
                          Symbol (!@#$%^&*)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2C3E2E]">
                  Confirm New Password:
                </label>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    required
                    placeholder="Repeat new password..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-[#FAF6EE] border-[#E8DFD3] pr-10 text-xs text-[#2C3E2E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Passwords do not match
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isUpdatingPassword || !passwordStrength.isValid || newPassword !== confirmPassword}
                  className="w-full rounded-full bg-[#2C3E2E] hover:bg-[#1E2B20] text-white text-xs font-bold py-2.5 cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingPassword ? "Hashing & Updating..." : "Update Master Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Inactivity Timeouts & Recovery Keys */}
        <div className="lg:col-span-5 space-y-6">
          {/* Session Auto-Lock */}
          <div className="rounded-3xl border border-[#E8DFD3] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F0EAE0]">
              <Clock className="h-5 w-5 text-[#D07A60]" />
              <h3 className="font-display text-base font-bold text-[#2C3E2E]">
                Session Inactivity Auto-Lock
              </h3>
            </div>

            <p className="text-xs text-[#6D6964] leading-relaxed">
              For security in a busy café environment, automatically lock the admin portal when no activity is detected.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {[
                { mins: 15, label: "15 Minutes" },
                { mins: 30, label: "30 Minutes (Default)" },
                { mins: 60, label: "1 Hour" },
                { mins: 240, label: "4 Hours" },
              ].map((t) => (
                <button
                  key={t.mins}
                  type="button"
                  onClick={() => handleTimeoutChange(t.mins)}
                  className={`rounded-2xl p-2.5 text-xs font-bold transition-all cursor-pointer text-center ${
                    (config?.sessionTimeoutMinutes || 30) === t.mins
                      ? "bg-[#2C3E2E] text-white shadow-xs"
                      : "bg-[#FAF6EE] text-[#4A4642] hover:bg-[#E8DFD3] border border-[#E8DFD3]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Emergency Recovery Master Key */}
          <div className="rounded-3xl border border-[#E8DFD3] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE0]">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#D07A60]" />
                <h3 className="font-display text-base font-bold text-[#2C3E2E]">
                  Emergency Recovery Key
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#6D6964] leading-relaxed">
              If master credentials are ever lost, this 16-character cryptographic recovery token resets both username and password.
            </p>

            <div className="rounded-2xl bg-[#FAF6EE] border border-[#E8DFD3] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D6964]">
                  Master Recovery Code:
                </span>
                <span className="text-[10px] text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">
                  Keep Confidential
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={config?.recoveryKey || "Loading..."}
                  className="w-full rounded-xl bg-white border border-[#E8DFD3] px-3 py-2 text-xs font-mono font-bold text-[#2C3E2E] select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyRecoveryKey}
                  className="rounded-xl bg-[#2C3E2E] hover:bg-[#1E2B20] text-white p-2 text-xs font-bold shrink-0 cursor-pointer"
                  title="Copy Recovery Key"
                >
                  {hasCopiedRecovery ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleRegenerateRecoveryKey}
                disabled={isRegeneratingKey}
                className="text-[11px] text-[#6D6964] hover:text-[#2C3E2E] underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RefreshCw className={`h-3 w-3 ${isRegeneratingKey ? "animate-spin" : ""}`} />
                <span>Regenerate Key</span>
              </button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="rounded-full border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Lock Console Now</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
