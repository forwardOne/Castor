import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ChatHistory } from '@/components/chat-history';
import { ChatInput } from '@/components/chat-input';
import type { Message } from '@/types/types';

// Define the type for the context provided by the Outlet
type ChatContextType = {
  project: string | null;
  phase: string;
  input: string;
  setInput: (value: string) => void;
  messages: Message[];
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  displayedHistory: { project: string; phase: string; sessionId: string; messages: Message[] } | null;
  resumeDisplayedHistory: () => void;
  cancelHistoryDisplay: () => void;
};

function ChatPage() {
  const {
    project,
    phase,
    input,
    setInput,
    messages,
    isLoading,
    handleSubmit,
    displayedHistory,
    resumeDisplayedHistory,
    cancelHistoryDisplay,
  } = useOutletContext<ChatContextType>();

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-1 min-h-0 overflow-y-auto justify-center">
        <ChatHistory messages={displayedHistory ? displayedHistory.messages : messages} isLoading={isLoading} />
      </div>

      <div className="py-4 flex-shrink-0">
        <ChatInput
          phase={displayedHistory ? displayedHistory.phase : (phase || 'default')}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          project={displayedHistory ? displayedHistory.project : (project || '')}
          disabled={!project} // アクティブなチャットセッションがない場合のみ無効化
          displayedHistory={displayedHistory}
          resumeDisplayedHistory={resumeDisplayedHistory}
          cancelHistoryDisplay={cancelHistoryDisplay}
        />
      </div>
    </div>
  );
}

export default ChatPage;