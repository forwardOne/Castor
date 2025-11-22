import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { SidebarHeader } from "./sidebar-header";
import { SidebarActions } from "./sidebar-actions";
import { ProjectHistoryList } from "./sidebar-historylist";

interface AppSidebarProps {
  startNewChat: (project: string, phase: string) => void;
  displayHistory: (project: string, phase: string, sessionId: string) => void;
  project: string | null;
  resetChat: () => Promise<void>;
  isHistoryVisible: boolean;
  toggleHistoryVisibility: () => void;
}

export function AppSidebar({
  startNewChat,
  displayHistory,
  project,
  resetChat,
  isHistoryVisible,
  toggleHistoryVisibility,
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarContent className="bg-muted">
        {/* SidebarHeader: サイドバーのヘッダー部分（ロゴ、タイトル、ホームに戻る機能）を扱います。 */}
        <SidebarHeader project={project} resetChat={resetChat} />

        {/* SidebarActions: 「New Chat」と「New Project」ボタン、および関連するダイアログを扱います。 */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarActions
              startNewChat={startNewChat}
              isHistoryVisible={isHistoryVisible}
              toggleHistoryVisibility={toggleHistoryVisibility}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ProjectHistoryList: プロジェクトと履歴のアコーディオンリストを表示し、履歴の削除機能を扱います。 */}
        {isHistoryVisible && <ProjectHistoryList displayHistory={displayHistory} />}
      </SidebarContent>
    </Sidebar>
  );
}