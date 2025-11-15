import { useState, useCallback } from 'react';
import type{ Message } from '../types/types';
import { MessageRole } from '../types/types';

// 履歴プレビュー用の型定義
interface DisplayedHistory {
  project: string;
  phase: string;
  sessionId: string;
  messages: Message[];
}

export const useChat = () => {
  const [project, setProject] = useState<string | null>(null); 
  const [phase, setPhase] = useState('default');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayedHistory, setDisplayedHistory] = useState<DisplayedHistory | null>(null); // 履歴プレビュー用


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
      setSessionId(crypto.randomUUID());
      setDisplayedHistory(null); // 新規チャット開始時は履歴プレビューをクリア
      console.log(`New chat started. Project: ${data.project}, Phase: ${data.phase}`);

    } catch (error) {
      console.error('Error starting new session:', error);
      // ここでユーザーにエラーを通知するUIを出すのが望ましい
      // 例: toast通知など
    }
  }, []);

  // 過去の履歴を読み込み、セッションを再開する (内部利用)
  const loadAndResumeSession = useCallback((
    loadedHistory: Message[], 
    targetSessionId: string,
    targetProjectId: string,
    targetPhaseId: string
  ) => {
    setMessages(loadedHistory);
    setSessionId(targetSessionId);
    setProject(targetProjectId);
    setPhase(targetPhaseId);
    setDisplayedHistory(null); // 履歴復元時はプレビューをクリア
  }, []);

  // 履歴をプレビュー表示する (バックエンドセッションは復元しない)
  const displayHistory = useCallback(async (project: string, phase: string, sessionId: string) => {
    setIsLoading(true);
    try {
      const backendUrl = 'http://localhost:8000/load_history';
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project, phase, session_id: sessionId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to load history for display');
      }

      const historyData = await res.json(); // { phase: "...", messages: [...] }
      setDisplayedHistory({
        project,
        phase: historyData.phase,
        sessionId,
        messages: historyData.messages,
      });
    } catch (error) {
      console.error('Error displaying history:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // プレビュー中の履歴でセッションを復元する
  const resumeDisplayedHistory = useCallback(async () => {
    if (!displayedHistory) return;

    setIsLoading(true);
    try {
      const backendUrl = 'http://localhost:8000/resume_session';
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project: displayedHistory.project,
          phase: displayedHistory.phase,
          session_id: displayedHistory.sessionId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to resume session');
      }

      // バックエンドでのセッション復元が成功したら、フロントエンドの状態も更新
      loadAndResumeSession(
        displayedHistory.messages,
        displayedHistory.sessionId,
        displayedHistory.project,
        displayedHistory.phase
      );
    } catch (error) {
      console.error('Error resuming displayed history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [displayedHistory, loadAndResumeSession]);

  // 履歴プレビューをキャンセルする
  const cancelHistoryDisplay = useCallback(() => {
    setDisplayedHistory(null);
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !project) return;
    
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID();
      setSessionId(currentSessionId);
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: MessageRole.USER,
      parts: [{ text: input }],
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
          message: userMessage.parts[0].text, // parts[0].text を送信
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
          parts: [{ text: data.response }],
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else {
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: MessageRole.MODEL,
          parts: [{ text: `エラー: ${data.detail || 'バックエンド接続に失敗しました'}` }],
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: MessageRole.MODEL,
        parts: [{ text: `通信エラーが発生しました: ${error instanceof Error ? error.message : String(error)}` }],
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
    loadAndResumeSession, // 内部利用だが、念のため公開
    displayedHistory,
    displayHistory,
    resumeDisplayedHistory,
    cancelHistoryDisplay,
  };
};
