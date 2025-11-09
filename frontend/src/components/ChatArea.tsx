import React, { useState } from 'react';

function ChatArea() {
  // const [project, setProject] = useState('default_project'); // プロジェクト選択は一旦コメントアウト
  const [phase, setPhase] = useState('default');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('ここにAIの応答が表示されます。');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim())
      return;

    setIsLoading(true);
    setResponse('AIが考え中です...');

    try {
      const backendUrl = 'http://localhost:8000/chat'; // FastAPIのエンドポイント
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // バックエンドのChatRequestの型に合わせて送信
        body: JSON.stringify({ message, phase }), 
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.response);
      } else {
        setResponse(`エラー: ${data.detail || 'バックエンド接続に失敗しました'}`);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setResponse(`通信エラーが発生しました: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <h1>Castor</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            フェーズ選択:
            <select value={phase} onChange={(e) => setPhase(e.target.value)} disabled={isLoading}>
              <option value="default">Default (丁寧な応答)</option>
              <option value="creative">Creative (創造的な応答)</option>
              <option value="analyst_with_search">Analyst (JSON出力 + Google Search)</option>
            </select>
          </label>
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="メッセージを入力してください..."
          rows={4}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !message.trim()}>
          {isLoading ? '送信中...' : '送信'}
        </button>
      </form>

      <div className="response-box">
        <h2>AI応答</h2>
        <p style={{ whiteSpace: 'pre-wrap' }}>{response}</p>
      </div>
    </div>
  );
}

export default ChatArea;
