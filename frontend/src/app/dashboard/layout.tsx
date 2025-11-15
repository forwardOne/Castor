// frontend/src/app/dashboard/layout.tsx
import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useChat } from "@/hooks/useChat";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function InnerLayout() {
  const chatState = useChat();
  const { project, phase } = chatState;
  const { state: sidebarState } = useSidebar(); // useSidebar を呼び出し

  return (
    <div className="flex h-screen w-screen bg-sidebar">
      <AppSidebar startNewChat={chatState.startNewChat} displayHistory={chatState.displayHistory} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center bg-card rounded-tl-lg rounded-tr-lg gap-2">
          <div className="flex items-center gap-4 px-3">
            <SidebarTrigger className="" />
            {sidebarState === 'collapsed' && (
              <div className="text-2xl text-muted-foreground font-semibold mb-1 pr-3">Castor</div>
            )}
            {project && (
              <>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-base font-semibold text-blue-500">{project}</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-base font-semibold text-blue-500">{phase}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-card rounded-bl-lg rounded-br-lg p-6">
          <Outlet context={chatState} />
        </main>
      </SidebarInset>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <InnerLayout />
    </SidebarProvider>
  );
}
