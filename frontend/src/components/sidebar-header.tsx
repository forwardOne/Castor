import * as React from "react";
import { Shield } from "lucide-react";
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

interface SidebarHeaderProps {
  project: string | null;
  resetChat: () => Promise<void>;
}

export function SidebarHeader({ project, resetChat }: SidebarHeaderProps) {
  const [isHomeAlertOpen, setIsHomeAlertOpen] = React.useState(false);

  const handleGoHome = () => {
    if (project) {
      setIsHomeAlertOpen(true);
    } else {
      resetChat();
    }
  };

  const confirmGoHome = () => {
    resetChat();
    setIsHomeAlertOpen(false);
  };

  return (
    <>
      <div
        className="group flex h-14 shrink-0 items-center justify-start px-3 gap-3 border-b border-border cursor-pointer"
        onClick={handleGoHome}
      >
        <Shield className="h-6 w-6 text-sidebar-foreground"/>
        <div className="group-data-[state=collapsed]:hidden leading-1">
          <span className="inline-block text-2xl font-semibold text-sidebar-foreground">CASTOR</span><br />
          <span className="text-xs text-muted-foreground">AI Pentest Assistant</span>
        </div>
      </div>

      <AlertDialog open={isHomeAlertOpen} onOpenChange={setIsHomeAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>セッションを終了しホーム画面に戻りますか？</AlertDialogTitle>
            <AlertDialogDescription>
              現在のチャットセッションは終了しますが、ヒストリーからいつでも再開できます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmGoHome}>Go Home</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
