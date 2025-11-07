# Castor - AI Pentest Assistant
（開発途中）<br>
このプロジェクトは、サイバーセキュリティ学習（特にBoot2RootやCTF）を手助けするためのAIエージェントアプリケーションです。

利用の際は必ず自己責任で学習目的かつ提供された環境内に限定してください。<br>
一般のネットワーク環境に対して無許可でハッキング及びそれらに該当する侵害行為を行うのは犯罪です。

## 技術スタック

### バックエンド
- Python 3.10+
- FastAPI
- Google Generative AI SDK

### フロントエンド
- React
- Vite
- TypeScript

## ディレクトリ構成
```
castor/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── chat_logic.py
│   │   ├── storage_logic.py
│   │   └── schemas.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   └── src/
│       ├── components/
│       ├── hooks/
│       └── services/
├── tests/
├── Article/
└── README.md
```

## セットアップと実行方法

### 1. 共通の準備
- プロジェクトのルートで、`.env`ファイルを`backend`ディレクトリ内に作成し、Google AI Studioから取得したAPIキーを設定します。
  ```
  GEMINI_API_KEY="YOUR_API_KEY_HERE"
  ```

### 2. バックエンドの起動
1. `backend`ディレクトリに移動します。
   ```bash
   cd backend
   ```
2. Pythonの仮想環境を作成し、有効化します。
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. 依存関係をインストールします。
   ```bash
   pip install -r requirements.txt
   ```
4. FastAPIサーバーを起動します。
   ```bash
   uvicorn app.main:app --reload
   ```
   サーバーは `http://127.0.0.1:8000` で起動します。

### 3. フロントエンドの起動
1. `frontend`ディレクトリに移動します。
   ```bash
   cd frontend
   ```
2. 依存関係をインストールします。
   ```bash
   npm install
   ```
3. 開発サーバーを起動します。
   ```bash
   npm run dev
   ```
   アプリケーションは `http://localhost:5173` でアクセス可能になります。


## 履歴
- 開発方針<br>
  - 多少冗長的であっても複雑なことはしない」<br>
  - 「動作パフォーマンスより構造的合理性を優先する」<br>
  - 「可読性を優先した定型的な記法を用いる」<br>
  - 「責任の分離を行う場合は出口まで設計する」<br>
- **2025-11-06:** プロジェクトの初期セットアップとディレクトリ構成の整理。
  - バックエンドロジックとしてFastAPIのエンドポイント、GeminiAPIの呼び出し、型定義の分離、CRUDロジックを実装。
  - ローカル起動前提のため、アプリ内のCRUDはチャット履歴をJSONで保存する形で設計。
  - 入力とレスポンスの受け取りを行う最低限のフロントエンドを実装。
  - 本格的なReactでのフロント開発を見据えて`src`内に`components`, `hooks`, `services`ディレクトリを新設。
- **2025-11-07:** React Routerを導入しSPAの基礎を構築。UI基盤として`shadcn/ui`と`Tailwind CSS`を導入し、ダッシュボードレイアウトに必要なコンポーネント群を追加。