// frontend/src/components/chat-input.tsx
import React from 'react';
import { ArrowUpIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";


interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  phase: string;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  project: string;
  disabled?: boolean; //
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  isLoading,
  handleSubmit,
  disabled,
}) => {
  const placeholderText = disabled
    ? "サイドバーから「New Chat」を選択してチャットを開始してください"
    : "メッセージを入力してください...";

  return (
    <form onSubmit={handleSubmit}>

      <div className="flex flex-col border border-muted rounded-2xl shadow-lg bg-card p-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholderText}
          disabled={disabled || isLoading}
          className="bg-transparent text-card-foreground resize-none border-none focus-visible:ring-0 shadow-none min-h-[50px] p-2"
        />

        <div className="flex items-center p-1">
          <div className="flex-grow" />
          <Button
            type="submit"
            size="icon"
            className="rounded-full h-8 w-8"
            disabled={disabled || isLoading || !input.trim()}
          >
            <ArrowUpIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};
