import * as React from "react";
import { FolderPlus, SquarePen, PanelTopOpen, PanelTopClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useProject } from "@/hooks/useProject";
import { phaseLists } from "@/lib/phases";

interface SidebarActionsProps {
  startNewChat: (project: string, phase: string) => void;
  isHistoryVisible: boolean;
  toggleHistoryVisibility: () => void;
}

export function SidebarActions({ startNewChat, isHistoryVisible, toggleHistoryVisibility }: SidebarActionsProps) {
  const {
    projects,
    newProjectName,
    setNewProjectName,
    isCreateProjectDialogOpen,
    setIsCreateProjectDialogOpen,
    handleCreateProject,
  } = useProject();

  // For "New Chat" Dialog
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<string>("");
  const [selectedPhase, setSelectedPhase] = React.useState<string>("default");




  const handleStartChat = () => {
    if (!selectedProject) {
      console.error("Project must be selected");
      return;
    }
    startNewChat(selectedProject, selectedPhase);
    setIsNewChatDialogOpen(false);
  };

  React.useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].name);
    }
  }, [projects, selectedProject]);

  return (
    <>
      <div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button variant="ghost" className="w-full text-md justify-start hover:!bg-card !px-2" onClick={() => setIsNewChatDialogOpen(true)}>
                <SquarePen className="mr-2 h-4 w-4" /> <span className="group-data-[state=collapsed]:hidden">New Chat</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button variant="ghost" className="w-full text-md justify-start hover:!bg-card !px-2" onClick={() => setIsCreateProjectDialogOpen(true)}>
                <FolderPlus className="mr-2 h-4 w-4" /> <span className="group-data-[state=collapsed]:hidden">New Project</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button variant="ghost" className="flex w-full text-md justify-start hover:!bg-card !px-2" onClick={toggleHistoryVisibility}>
                {isHistoryVisible ? (
                  <PanelTopClose className="mr-2 h-4 w-4" />
                ) : (
                  <PanelTopOpen className="mr-2 h-4 w-4" />
                )}
                <span>History List</span>
                <span className="group-data-[state=collapsed]:hidden text-xs text-muted-foreground pt-[1px]">
                  {isHistoryVisible ? "" : "Click Open"}
                </span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>

      {/* "New Project" Dialog */}
      <Dialog open={isCreateProjectDialogOpen} onOpenChange={setIsCreateProjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>プロジェクト名を入力してください。例: "THM_OWASP_Top10"</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input id="newProjectName" placeholder="Project Name" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateProjectDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProject}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* "New Chat" Dialog */}
      <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a New Chat</DialogTitle>
            <DialogDescription>プロジェクト名とフェーズを選択してください。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Project:</p>
                <span className="text-xs text-muted-foreground ">(チャット開始には作成済のプロジェクトが必要です。)</span>
              </div>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select a project" /></SelectTrigger>
                <SelectContent>{projects.map((p) => (<SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Phase: </p>
                <span className="text-xs text-muted-foreground">(defaultは抽象的な対話用です。フェーズの指定を推奨します。)</span>
              </div>
              <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select a phase" /></SelectTrigger>
                <SelectContent>{phaseLists.map((p) => (<SelectItem key={p} value={p}>{p.replace(/_/g, ' ')}</SelectItem>))}</SelectContent>
              </Select>
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewChatDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleStartChat}>Start Chat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
