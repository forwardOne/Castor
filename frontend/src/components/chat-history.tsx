// frontend/src/components/chat-history.tsx
import React from 'react';
import type{ Message } from '../types/types';
import { MessageRole } from '../types/types';
import { ScrollArea } from "@/components/ui/scroll-area";

// interface
interface ChatHistoryProps {
  messages: Message[];
  isLoading: boolean;
}

// チャット履歴がない場合のウェルカム画面
const WelcomeScreen: React.FC = () => (
    <div className="flex flex-col items-center text-foreground">
        <div className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
            Hello, User
        </div>
        <p className="text-2xl text-muted-foreground">What "root" shall we hack today?</p>
    </div>
);

// チャットメッセージバブル
const ChatMessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;

  // ユーザーメッセージ(右寄せ、最大幅設定、背景色)
  const userContainerClass = 'justify-end';
  const userBubbleClass = 'max-w-xs lg:max-w-md gap-2 rounded-lg px-3 py-3 mr-2 text-[17px] bg-accent text-accent-foreground ml-auto';

  // モデルメッセージ(左寄せ、最大幅なし、背景色)
  const modelContainerClass = 'justify-start';
  const modelBubbleClass = 'w-full gap-2 rounded-lg px-2 py-2 mr-5 text-[17px] bg-card text-card-foreground'; 

  return (
    <div className={`flex mb-6 ${isUser ? userContainerClass : modelContainerClass}`}>
      
      <div
        className={`px-2 py-2 ${
          isUser
            ? userBubbleClass
            : modelBubbleClass
        }`}
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {message.content}
      </div>
    </div>
  );
}

// ローディングインジケーター
const LoadingIndicator = () => (
  <div className="flex justify-start">
    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-muted text-muted-foreground">
      AIが考え中です...
    </div>
  </div>
);

export const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading }) => {
  if (messages.length === 0 && !isLoading) {
    return <div className="flex flex-1 items-center justify-center p-4"><WelcomeScreen /></div>;
  }

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col space-y-4">
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <LoadingIndicator />}
      </div>
    </ScrollArea>
  );
};
