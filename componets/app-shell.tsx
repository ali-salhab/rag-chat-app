"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAtom } from "jotai";

import { sidebarOpenAtom } from "@/lib/atoms/sidebar";
import { AppTopbar } from "./app-topbar";

const navigationItems = [
  {
    href: "/chat",
    label: "Chat",
    icon: "💬",
  },
  {
    href: "/upload",
    label: "Upload files",
    icon: "📄",
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useAtom(sidebarOpenAtom);

  return (
    <div className="relative flex h-dvh overflow-hidden bg-zinc-900">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 cursor-default bg-transparent"
        />
      )}

      <aside
        className={`z-40 flex shrink-0 flex-col overflow-hidden border-r border-zinc-800 bg-zinc-950 text-white transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? "w-64 translate-x-0"
            : "w-0 -translate-x-full border-transparent"
        }`}
      >
        <div className="flex h-16 min-w-64 items-center justify-between px-4">
          <Link href="/chat" className="text-lg font-bold">
            Local RAG
          </Link>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-lg px-2 py-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        <nav className="min-w-64 space-y-2 px-3">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <p className="mt-auto min-w-64 px-6 pb-5 text-xs text-zinc-500">
          Ollama + LangChain
        </p>
      </aside>

      <div className="relative z-0 flex min-w-0 flex-1 flex-col">
        <AppTopbar />

        <div className="relative min-h-0 flex-1">
          {!isSidebarOpen && (
            <button
              type="button"
              aria-label="Open sidebar"
              onClick={() => setIsSidebarOpen(true)}
              className="absolute left-4 top-4 z-20 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-white shadow-lg transition hover:bg-zinc-800"
            >
              ☰
            </button>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
