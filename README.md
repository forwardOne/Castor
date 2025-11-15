# Castor - AI Pentest Assistant

## プロジェクト概要
本ツールは、サイバーセキュリティ学習支援および運用効率向上を目的として設計された、安全性と実務適用性を重視したローカル完結型のAI支援アプリケーションです。

**主要な設計原則:**

*   **限定された利用環境と対象ユーザー**: VM環境上での動作とアタック対象マシンへのVPN接続を前提とし、基礎的なIT知識を持つユーザーを対象としています。
*   **最小限の外部依存**: APIキーやチャット履歴などの機密情報は外部に送信せず、ローカル環境で完結します。社内のAI契約やVPN環境に依存することで、情報漏えいリスクを最小化しています。
*   **運用負荷と環境干渉の最小化**: Dockerやクラウドデプロイは使用せず、VM上でのメモリ消費やネットワークログへの干渉を避ける設計です。特定環境内での安定動作を優先し、環境差異による障害リスクを低減します。
*   **AI応答制御によるガバナンス設計**: 内部プロンプト制御により、利用者が意図せずに冒すリスクを低減・防止します。モデルやフェーズごとの設定を統一し、誤操作による結果のばらつきを抑制します。
*   **拡張性・再現性の確保**: スキャン結果や解析結果を標準化されたJSON形式で保持し、後続処理やレポート生成に活用可能です。IDEからも起動出来、CLIやバックエンドモジュールとの統合を容易にし、将来的な自動化・CI/CD環境への適応も視野に入れています。

利用の際は必ず自己責任で学習目的かつ提供された環境内に限定してください。一般のネットワーク環境に対して無許可でハッキング及びそれらに該当する侵害行為を行うのは犯罪です。
<p align="center">
<img width="784" height="552" alt="Image" src="https://github.com/user-attachments/assets/b891264b-96db-41b1-8bbe-e94ef1a94196" />
</p>
## 機能一覧
- AIとのチャットを通じたサイバーセキュリティ学習支援
- チャット履歴の管理
- Markdownおよびコードブロックの整形表示

### 回答例イメージ
<img width="392" height="275" alt="Image" src="https://github.com/user-attachments/assets/0c34d36e-6523-46a1-ab5d-8e85eae2756b" />

## 技術スタック

### バックエンド
- **言語**: Python 3.10+
- **フレームワーク**: FastAPI
- **AI SDK**: Google Generative AI SDK (google-genai)
- **その他**: Pydantic, python-dotenv

### フロントエンド
- **フレームワーク**: React
- **ビルドツール**: Vite
- **言語**: TypeScript
- **ルーティング**: React Router
- **UIライブラリ**: shadcn/ui
- **スタイリング**: Tailwind CSS
- **Markdownレンダリング**: react-markdown, remark-gfm
- **シンタックスハイライト**: react-syntax-highlighter

## セットアップ手順

### 前提条件
- Python 3.10+
- Node.js (LTS推奨)
- npm または yarn

### 1. リポジトリのクローン
```bash
git clone https://github.com/your-repo/castor.git
cd castor
```

### 2. 環境変数の設定
プロジェクトルート (`castor/`) に `.env` ファイルを作成し、Google AI Studioから取得したAPIキーを設定します。
```
GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY_HERE"
```

### 3. バックエンドのセットアップと起動

#### 仮想環境の作成とアクティベート
```bash
# プロジェクトルートで実行
python -m venv backend/venv
# Windows
backend\venv\Scripts\activate
# macOS/Linux
source backend/venv/bin/activate
```

#### 依存関係のインストール
```bash
# 仮想環境がアクティブな状態で実行
pip install -r backend/requirements.txt
```

#### バックエンドの起動
```bash
# プロジェクトルートで実行
uvicorn app.main:app --reload --app-dir backend
```
サーバーは `http://127.0.0.1:8000` で起動します。

### 4. フロントエンドのセットアップと起動

#### 依存関係のインストール
```bash
cd frontend
npm install
```

#### フロントエンドの起動
```bash
npm run dev
```
アプリケーションは `http://localhost:5173` でアクセス可能になります。

## 開発
- バックエンドのコードは `backend/app/` 以下にあります。
- フロントエンドのコードは `frontend/src/` 以下にあります。

## テスト
現在、テストコードは準備中です。

## ライセンス
現在、ライセンスは準備中です。

## 履歴

- **2025-11-06**: プロジェクトの初期セットアップとディレクトリ構成の整理。
  - バックエンドロジック（FastAPIエンドポイント、GeminiAPI呼び出し、型定義、CRUDロジック）を実装。
  - ローカル起動前提のチャット履歴JSON保存設計。
  - 最低限のフロントエンド（入力とレスポンス受け取り）を実装。
  - React開発を見据え`src`内に`components`, `hooks`, `services`ディレクトリを新設。
- **2025-11-07**: React Routerを導入しSPAの基礎を構築。UI基盤として`shadcn/ui`と`Tailwind CSS`を導入し、ダッシュボードレイアウトに必要なコンポーネント群を追加。
- **2025-11-12**: フロントエンドのアーキテクチャを大幅に刷新。
  - 将来の機能拡張を見据え、ルーティングとディレクトリ構成を再設計。
  - state管理とロジックをカスタムフックに集約し、コンポーネントの責務を分離。
  - チャットUIを`ChatHistory`と`ChatInput`コンポーネントに分割し、再利用性を向上。
  - バックエンドAPIとの連携を強化し、データ送受信の処理を一貫性のある形に修正。
- **2025-11-15**: チャット開始フローを全面的にリファクタリングし、UI/UXを改善。
  - サイドバーに「New Chat」ボタンとダイアログを新設し、プロジェクトとフェーズ選択後の会話開始フローに変更。
  - チャットの状態管理を`DashboardLayout`に集約。
  - バックエンドの`/new_session`エンドポイントを呼び出し、サーバー側でセッションを初期化。
  - ヘッダーにパンくずリストを実装。チャットエリアを常に表示し、未開始時は入力欄を無効化。`shadcn/ui`の`Select`コンポーネントを導入。
  - `google-genai` SDKの誤った`await`使用を修正し、`TypeError`を解決。`session_id`を用いたセッション管理を強化。
- **2025-11-16**: 初期バージョン完成に向けた最終調整。
  - フロントエンドにMarkdownレンダリングとコードブロックのシンタックスハイライト機能を追加。
  - READMEを更新し、プロジェクトの目的、設計原則、セットアップ手順、技術スタックを明確化。
  - READMEに動作イメージのスクリーンショットを追加。
- **2025-11-16**: **初期バージョン完成**
