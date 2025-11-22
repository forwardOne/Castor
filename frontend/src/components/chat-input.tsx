// frontend/src/components/chat-input.tsx
import React from 'react';
import { ArrowUpIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Message } from '@/types/types';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  phase: string;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  project: string;
  disabled?: boolean;
  displayedHistory: { project: string; phase: string; sessionId: string; messages: Message[] } | null;
  resumeDisplayedHistory: () => void;
  cancelHistoryDisplay: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  isLoading,
  handleSubmit,
  disabled,
  displayedHistory,
  resumeDisplayedHistory,
  cancelHistoryDisplay,
}) => {
  const placeholderText = disabled
    ? "サイドバーから「New Chat」を選択してください"
    : "メッセージを入力してください...";

  if (displayedHistory) {
    return (
      <div className='pb-10 max-md:pb-2'>
        <div className="flex flex-col border border-border rounded-4xl shadow-lg bg-muted mx-2 sm:mx-6 lg:mx-auto lg:max-w-3xl">
          <div className="flex flex-col items-center justify-center h-29 p-2">
            <p className="text-muted-foreground text-center">
              履歴を表示中: プロジェクト「{displayedHistory.project}」フェーズ「{displayedHistory.phase}」
            </p>
            <div className="flex gap-2">
              <Button onClick={resumeDisplayedHistory} disabled={isLoading}>
                セッションを復元
              </Button>
              <Button variant="outline" onClick={cancelHistoryDisplay} disabled={isLoading}>
                キャンセル
              </Button>
            </div>
          </div>
      </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="pb-10 max-md:pb-2">
      <div className="flex flex-col border border-border rounded-4xl shadow-lg bg-card mx-2 sm:mx-6 lg:mx-auto lg:max-w-3xl">
        <div className='flex items-center pt-3 pl-3'>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholderText}
            disabled={disabled || isLoading}
            className="!bg-transparent text-md text-card-foreground resize-none border-none focus-visible:ring-0 shadow-none min-h-[56px]"
          />
        </div>
        <div className="flex items-center pr-3 pb-3">
          <div className="flex-grow" />
          <div className='flex items-center justify-center'>
            <Button
              type="submit"
              size="icon"
              className="rounded-full h-9 w-9"
              disabled={disabled || isLoading || !input.trim()}
            >
              <ArrowUpIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
