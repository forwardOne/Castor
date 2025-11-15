import { useState, useCallback } from 'react';
import type{ Message } from '../types/types';
import { MessageRole } from '../types/types';

export const useChat = () => {
  const [project, setProject] = useState<string | null>(null); 
  const [phase, setPhase] = useState('default');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  // 新しいチャットセッションを開始する
  const startNewChat = useCallback(async (newProject: string, newPhase: string) => {
    try {
      const backendUrl = 'http://localhost:8000/new_session';
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project: newProject, phase: newPhase }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to initialize new session');
      }

      const data = await res.json();
      
      // API呼び出しが成功したらフロントエンドの状態を更新
      setProject(newProject);
      setPhase(newPhase);
      setMessages([]);
      setSessionId(crypto.randomUUID()); // フロントエンド側でもIDを保持するが、バックエンドのセッションが主
      console.log(`New chat started. Project: ${data.project}, Phase: ${data.phase}`);

    } catch (error) {
      console.error('Error starting new session:', error);
      // ここでユーザーにエラーを通知するUIを出すのが望ましい
      // 例: toast通知など
    }
  }, []);

  // 過去の履歴を読み込み、セッションを再開する
  const loadAndResumeSession = useCallback((
    loadedHistory: Message[], 
    targetSessionId: string,
    targetProjectId: string,
    targetPhaseId: string
  ) => {
    // 履歴を画面に表示
    setMessages(loadedHistory);
    // 継続するセッションID、プロジェクト、フェーズをセット
    setSessionId(targetSessionId);
    setProject(targetProjectId);
    setPhase(targetPhaseId);
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !project) return; // projectが設定されていない場合は送信しない
    
    // セッションIDの確定
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      // startNewChatで設定されるはずだが、念のためフォールバック
      currentSessionId = crypto.randomUUID();
      setSessionId(currentSessionId);
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: MessageRole.USER,
      content: input,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]); 
    setInput('');

    setIsLoading(true);

    try {
      const backendUrl = 'http://localhost:8000/chat';
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          phase,
          project,
          session_id: currentSessionId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: MessageRole.MODEL,
          content: data.response,
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else {
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: MessageRole.MODEL,
          content: `エラー: ${data.detail || 'バックエンド接続に失敗しました'}`,
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: MessageRole.MODEL,
        content: `通信エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    project,
    phase,
    input,
    setInput,
    messages,
    isLoading,
    handleSubmit,
    sessionId,
    startNewChat,
    loadAndResumeSession,
  };
};
