import React from 'react';
import type { Message } from '../types/types';
import { MessageRole } from '../types/types';
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from "rehype-highlight"; // シンタックスハイライト
import "highlight.js/styles/github-dark-dimmed.css"; // ハイライトテーマ
import { CodeBlock } from "@/components/code-block"; // コードブロック


// interface
interface ChatHistoryProps {
  messages: Message[];
  isLoading: boolean;
}

// チャット履歴がない場合のウェルカム画面
const WelcomeScreen: React.FC = () => (
    <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
            Hello, User
        </div>
        <p className="text-2xl text-muted-foreground">What "root" shall we hack today?</p>
    </div>
);

// チャットメッセージバブル
const ChatMessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;

  // ユーザーメッセージ(右寄せ、最大幅設定、その他設定もここで)
  const userContainerClass = 'justify-end';
  const userBubbleClass = 'max-w-ms lg:max-w-md gap-2 rounded-2xl px-4 py-2 mr-3 ml-auto text-[16px] leading-relaxed bg-accent text-accent-foreground space-y-4';

  // モデルメッセージ(左寄せ、最大幅なし、その他設定もここで)
  const modelContainerClass = 'justify-start';
  const modelBubbleClass = 'w-full gap-2 rounded-lg px-2 py-2 mr-3 text-[16px] leading-relaxed text-card-foreground space-y-6'; 

  return (
    <div className={`flex mb-6 ${isUser ? userContainerClass : modelContainerClass}`}>
      
      <div
        className={`px-2 py-2 ${
          isUser
            ? userBubbleClass
            : modelBubbleClass
        }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            code: CodeBlock, // コードブロック処理
          }}
        >
          {message.parts[0].text}
        </ReactMarkdown>
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
    return <WelcomeScreen />;
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
