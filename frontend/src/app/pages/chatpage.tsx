import React from 'react'; // 一応
import { useChat } from '@/hooks/useChat';
import { useProject } from '@/hooks/useProject'; 
import { ChatHistory } from '@/components/chat-history';
import { ChatInput } from '@/components/chat-input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"; // Button は残す (DropdownMenuTrigger で使用)

function ChatPage() {
  const {
    project,
    setProject,
    phase,
    setPhase,
    input,
    setInput,
    messages,
    isLoading,
    handleSubmit,
  } = useChat();

  const {
    projects,
  } = useProject(setProject); // useProject から projects のみ取得

  return (
    <div className="flex flex-col h-full">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="focus-visible:ring-0 justify-between">
              Project: {project}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuLabel>Select Project</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {projects.map((p) => (
              <DropdownMenuItem key={p} onClick={() => setProject(p)}>
                {p}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* プロジェクト作成ボタンは削除 */}
      </div>

      <div className="flex-1 min-h-0">
        <div className="flex flex-col h-full w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ChatHistory messages={messages} isLoading={isLoading} />
        </div>
      </div>
      <div className="">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ChatInput
            phase={phase}
            setPhase={setPhase}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            project={project} // project を渡す
          />
        </div>
      </div>

      {/* プロジェクト作成ダイアログは削除 */}
    </div>
  );
}

export default ChatPage;