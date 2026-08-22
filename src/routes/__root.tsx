import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";
import { BookTableProvider } from "@/components/site/BookTableModal";
import { CartProvider } from "@/context/CartContext";
import { AppProvider } from "@/context/AppContext";
import { CartDrawer } from "@/components/site/CartDrawer";
import { ItemCustomizeModal } from "@/components/site/ItemCustomizeModal";
import { OrderTrackerModal } from "@/components/site/OrderTrackerModal";
import { CustomerNotificationBanner } from "@/components/site/CustomerNotificationBanner";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF6EE] px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-[#2C3E2E]">404</h1>
        <h2 className="mt-4 font-display text-2xl font-semibold text-[#2C3E2E]">Page not found</h2>
        <p className="mt-2 text-sm text-[#6D6964]">
          The page you're looking for doesn't exist or has moved. Come relax in our main cafe room!
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[#2C3E2E] px-6 py-2.5 text-xs font-semibold tracking-wider text-[#FAF6EE] transition-colors hover:bg-[#1E2B20]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF6EE] px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold text-[#2C3E2E]">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-[#6D6964]">
          We encountered an issue loading this page. Let's get you back to the coffee bar.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-[#2C3E2E] px-6 py-2.5 text-xs font-semibold tracking-wider text-[#FAF6EE] transition-colors hover:bg-[#1E2B20]"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-[#E8DFD3] bg-white px-6 py-2.5 text-xs font-semibold tracking-wider text-[#2C3E2E] transition-colors hover:bg-[#F3EDE2]"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Bloom Café — Coffee • Food • Good Times" },
      {
        name: "description",
        content:
          "Bloom Café in Melbourne — Good coffee, good food, Good Mood Everyday. Handcrafted specialty coffee, artisan brunch, and warm cozy atmosphere.",
      },
      { name: "author", content: "Bloom Café" },
      { name: "theme-color", content: "#FAF6EE" },
      { name: "twitter:site", content: "@BloomCafe" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <CartProvider>
          <BookTableProvider>
            <div className="flex min-h-screen flex-col bg-[#FAF6EE] text-[#253328] selection:bg-[#D07A60]/20 selection:text-[#2C3E2E]">
              <Header />
              <main className="flex-1">
                <Outlet />
              </main>
              <Footer />
            </div>
            <FloatingActions />
            <FloatingWhatsApp />
            <CartDrawer />
            <ItemCustomizeModal />
            <OrderTrackerModal />
            <CustomerNotificationBanner />
            <Toaster richColors position="top-right" />
          </BookTableProvider>
        </CartProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}
