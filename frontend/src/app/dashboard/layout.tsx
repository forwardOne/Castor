// frontend/src/app/dashboard/layout.tsx
import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useChat } from "@/hooks/useChat";

export default function DashboardLayout() {
  const { setProject } = useChat();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-sidebar">
        <AppSidebar setProject={setProject} />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center bg-card rounded-tl-lg rounded-tr-lg gap-2">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger className="" />
              <h2 className="text-lg text-card-foreground font-semibold">Castor</h2>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-card rounded-bl-lg rounded-br-lg p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
