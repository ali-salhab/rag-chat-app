import { AppSidebar } from "@/componets/app-sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-dvh bg-zinc-900 text-white">
      <AppSidebar />

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
};

export default Layout;
