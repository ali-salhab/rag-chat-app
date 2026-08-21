"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { List, FileArchiveIcon } from "lucide-react";

const NavigationItems = [
  {
    href: "/chat",
    title: "Chat",
    icon: List,
  },
  {
    href: "/upload",
    title: "Upload",
    icon: FileArchiveIcon,
  },
];
export const AppSidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="flex flex-col w-64 border-r border-zinc-800 bg-zinc-500 text-white">
      <Link
        href="/chat"
        className="mb-8 rounded-xl px-3 py-2 text-xl font-bold"
      >
        Local RAG
      </Link>
      <nav className="space-y-2">
        {NavigationItems.map((item) => {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-xl px-3 py-2 hover:bg-zinc-700 ${
                pathname === item.href ? "bg-zinc-700" : ""
              }`}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
