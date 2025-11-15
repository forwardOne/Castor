import * as React from "react";
import { Calendar, Home, Inbox, Search, Settings, PlusIcon, MessageSquarePlus } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
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
import { useProject } from "@/hooks/useProject";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

interface AppSidebarProps {
  startNewChat: (project: string, phase: string) => void;
}

export function AppSidebar({ startNewChat }: AppSidebarProps) {
  // For "New Project"
  const {
    projects,
    newProjectName,
    setNewProjectName,
    isCreateProjectDialogOpen,
    setIsCreateProjectDialogOpen,
    handleCreateProject,
  } = useProject();

  // For "New Chat"
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<string>("");
  const [selectedPhase, setSelectedPhase] = React.useState<string>("default");
  const phaseLists = [ "default", "creative", "analyst_with_search" ];

  const handleStartChat = () => {
    if (!selectedProject) {
      // Add some user feedback, e.g., a toast or an alert
      console.error("Project must be selected");
      return;
    }
    startNewChat(selectedProject, selectedPhase);
    setIsNewChatDialogOpen(false);
  };

  React.useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground">Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Action Buttons */}
        <SidebarGroup>
          <SidebarGroupContent className="grid gap-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsNewChatDialogOpen(true)}>
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsCreateProjectDialogOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* "New Project" Dialog */}
      <Dialog open={isCreateProjectDialogOpen} onOpenChange={setIsCreateProjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Enter a name for your new project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="newProjectName"
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
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
            <DialogDescription>
              Select a project and a phase to begin.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <p className="text-sm text-muted-foreground">Project</p>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <p className="text-sm text-muted-foreground">Phase</p>
              <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a phase" />
                </SelectTrigger>
                <SelectContent>
                  {phaseLists.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewChatDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleStartChat}>Start Chat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}