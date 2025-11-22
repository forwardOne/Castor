import * as React from "react";
import { Trash2, MoreVertical, Folder } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  // SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useProject } from "@/hooks/useProject";

interface ProjectHistoryListProps {
  displayHistory: (project: string, phase: string, sessionId: string) => void;
}

type HistoryToDelete = { projectName: string; phase: string; sessionId: string } | null;

export function ProjectHistoryList({ displayHistory }: ProjectHistoryListProps) {
  const { projects, deleteHistory } = useProject();
  const [historyToDelete, setHistoryToDelete] = React.useState<HistoryToDelete>(null);

  const handleConfirmDelete = () => {
    if (!historyToDelete) return;
    deleteHistory(historyToDelete.projectName, historyToDelete.phase, historyToDelete.sessionId);
    setHistoryToDelete(null);
  };

  return (
    <>
      <div className="flex min-h-0 overflow-y-auto overflow-x-hidden">
        <ScrollArea className="flex flex-1">
          <SidebarGroup className="flex-1">
            {/* <SidebarGroupLabel className="text-xs text-muted-foreground px-2">Histories</SidebarGroupLabel> */}
            <SidebarGroupContent className="group-data-[state=collapsed]:hidden"> 
              {projects.length === 0 ? (
                <p className="w-full text-md p-2 rounded-lg hover:no-underline">No projects found.</p>
              ) : (
                <Accordion type="multiple" className="w-full">
                  {projects.map((projectData) => (
                  <AccordionItem key={projectData.name} value={projectData.name} className="border-b-0">
                    <AccordionTrigger className="w-full text-md px-2 py-1.75 hover:!bg-card hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Folder className="mr-2 h-4 w-4" />
                        <span>{projectData.name}</span>
                      </div>
                    </AccordionTrigger>
                      <AccordionContent className="pb-1">
                        {projectData.histories.length === 0 ? (
                          <p className="text-xs text-muted-foreground pl-10 py-1">No history.</p>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {projectData.histories.map((historyItem) => (
                              <div key={historyItem.id} className="flex w-full items-center justify-between rounded-lg hover:bg-card group/card">
                                <div
                                  className="flex-1 justify-start h-auto text-xs pl-10 py-1"
                                  onClick={() => displayHistory(projectData.name, historyItem.phase, historyItem.id)}
                                >
                                  <span className="truncate">{historyItem.phase}_{historyItem.id.substring(0, 12)}...</span>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 shrink-0 opacity-0 group-hover/card:opacity-75 transition-opacity"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreVertical className="h-3.5 w-3.5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent side="right" align="center">
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setHistoryToDelete({
                                          projectName: projectData.name,
                                          phase: historyItem.phase,
                                          sessionId: historyItem.id,
                                        });
                                      }}
                                      className="text-red-500"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" /> Delete History
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            ))}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </div>

      <AlertDialog open={!!historyToDelete} onOpenChange={(isOpen) => !isOpen && setHistoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>本当によろしいですか?</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。 このチャット履歴を完全に削除します。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
