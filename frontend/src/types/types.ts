// frontend/src/types/types.ts

export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface Message {
  id: string;
  role: MessageRole;
  parts: { text: string }[]; // content から parts に変更
}

export interface ChatRequest {
  project?: string; // バックエンドでデフォルト値があるためオプショナル
  phase?: string;   // バックエンドでデフォルト値があるためオプショナル
  message: string;
}

export interface ChatResponse {
  response: string; // AIの応答メッセージ
  // 必要に応じて他のフィールドを追加
}

export interface HistoryRequest {
  project: string;
  phase: string;
}

export interface CreateProjectRequest {
  project: string;
}
