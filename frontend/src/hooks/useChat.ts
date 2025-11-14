import { useState } from 'react';
import type{ Message } from '../types/types';
import { MessageRole } from '../types/types';

export const useChat = () => {
  const [project, setProject] = useState('default_project'); 
  const [phase, setPhase] = useState('default');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(), // ユニークID生成
      role: MessageRole.USER, // 'user'の代わりにenumを使用
      content: input,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]); 
    setInput(''); // 入力フィールドをクリア

    setIsLoading(true);

    try {
      const backendUrl = 'http://localhost:8000/chat'; // FastAPIのエンドポイント
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content, phase, project }),
      });

      const data = await res.json();

      if (res.ok) {
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: MessageRole.MODEL, // 'model'の代わりにenumを使用
          content: data.response,
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]); // AI応答を追加
      } else {
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: MessageRole.MODEL, // 'model'の代わりにenumを使用
          content: `エラー: ${data.detail || 'バックエンド接続に失敗しました'}`,
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]); // エラーメッセージを追加
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: MessageRole.MODEL, // 'model'の代わりにenumを使用
        content: `通信エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]); // エラーメッセージを追加
    } finally {
      setIsLoading(false);
    }
  };

  return {
    project,
    setProject,
    phase,
    setPhase,
    input,
    setInput,
    messages,
    isLoading,
    handleSubmit,
  };
};
