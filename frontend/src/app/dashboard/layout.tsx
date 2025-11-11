// frontend/src/app/dashboard/layout.tsx
import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <h3 className="text-lg font-semibold">Dashboard</h3>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
