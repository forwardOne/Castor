import { useState } from "react";
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
import { ModeToggle } from "@/components/mode-toggle";

function InnerLayout() {
  const chatState = useChat();
  const { project, phase, resetChat } = chatState;
  const { state: sidebarState } = useSidebar(); // useSidebar を呼び出し
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);

  const toggleHistoryVisibility = () => setIsHistoryVisible(prev => !prev);

  return (
    <div className="flex h-screen w-screen bg-muted font-notosansjp">
      <AppSidebar
        startNewChat={chatState.startNewChat}
        displayHistory={chatState.displayHistory}
        resetChat={resetChat}
        project={project}
        isHistoryVisible={isHistoryVisible}
        toggleHistoryVisibility={toggleHistoryVisibility}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center bg-card md:rounded-tl-xl md:rounded-tr-xl gap-2">
          <div className="flex items-center gap-4 px-3">
            <SidebarTrigger className="" />
            {sidebarState === 'collapsed' && (
              <div className="text-lg text-muted-foreground font-semibold mb-1 pr-3">CASTOR - AI Pentest Assistant</div>
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
          <div className="ml-auto pr-3">
            <ModeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-hidden bg-card md:rounded-bl-xl md:rounded-br-xl">
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
