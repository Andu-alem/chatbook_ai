import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { ThemeProvider } from "~/components/theme-provider";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function HydrateFallback() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Book Icon */}
        <div className="relative">
          <div className="h-16 w-16 rounded-xl bg-indigo-500/20 animate-ping absolute inset-0" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
            📖
          </div>
        </div>

        {/* App Name with shimmer effect */}
        <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 animate-pulse">
          TalkBookAI
        </h1>

        {/* Subtext */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Loading your AI reading experience...
        </p>

        {/* Tailwind animated dots */}
        <div className="flex space-x-1 mt-2">
          <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}


export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Outlet />
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = "Oops!";
  let message = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? "404 Not Found" : "Error";
    message =
      error.status === 404
        ? "The page you are looking for does not exist."
        : error.statusText || message;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    message = error.message;
    stack = error.stack;
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-950 px-4 text-center">
      <div className="animate-pulse mb-6">
        <span className="text-6xl md:text-8xl">⚠️</span>
      </div>

      <h1 className="text-3xl md:text-5xl font-bold text-red-700 dark:text-red-400 mb-2">
        {title}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>

      {stack && (
        <pre className="max-w-full overflow-x-auto rounded-lg bg-gray-100 dark:bg-gray-800 p-4 text-left text-sm text-gray-800 dark:text-gray-200 shadow-inner">
          <code>{stack}</code>
        </pre>
      )}

      <a
        href="/"
        className="mt-8 inline-block rounded-lg bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 px-6 py-3 text-white font-semibold transition"
      >
        Go Home
      </a>
    </div>
  );
}

