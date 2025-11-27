# backend/main.py
# Endpoint definitions for FastAPI
import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .schemas import ChatRequest, HistoryRequest, CreateProjectRequest, NewSessionRequest
from .chat_logic import (
    init_chat_on_startup,
    send_chat_message,
    create_or_resume_session,
    )
from .storage_logic import (
    create_project, 
    load_history, 
    save_message, 
    get_projects_list, get_histories_list, 
    delete_project, delete_history
    )

# --- Lifespan pytestに推奨された ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_chat_on_startup()
    yield

# --- FastAPI ---
app = FastAPI()


# --- CORS(React/Vite) ---
origins = [
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Endpoints ---
@app.get("/")
def root():
    return {"message": "Castor Backend is running."}


@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    メッセージ送信、応答取得、履歴保存、非SSE
    セッション確立前提
    """
    try:
        response = await send_chat_message(message=request.message)
        
        save_message(request.project, request.phase, request.session_id, "user", request.message)
        save_message(request.project, request.phase, request.session_id, "model", response)
        
        return {"response": response}
    except ValueError as ve:
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"セッションエラー: {ve}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI応答エラー: {e}")


@app.post("/new_session")
async def new_session_endpoint(request: NewSessionRequest):
    """
    グローバルチャットセッションをリセットし、新しいProject/Phaseの設定で初期化する。
    """
    try:
        # 履歴なしでセッションを再構築し、新しいフェーズ設定を適用
        await create_or_resume_session(phase=request.phase, history=None)
        return {"message": "New chat session initialized successfully.", "project": request.project, "phase": request.phase}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"新規セッション作成に失敗: {e}")


@app.post("/resume_session")
async def resume_session_endpoint(request: HistoryRequest):
    """
    保存された履歴をロードし、GenAI APIに反映してセッションを再構築
    """
    try:
        history_data = load_history(request.project, request.phase, request.session_id)
        if not history_data["messages"]:
            return {"status": "no_history", "message": "履歴が存在しません"}

        # ロードした履歴とフェーズ設定でグローバルセッションを再構築
        await create_or_resume_session(phase=history_data["phase"], history=history_data["messages"])
        return {"status": "resumed", "message_count": len(history_data["messages"])}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"セッション再開失敗: {e}")


@app.post("/load_history")
async def load_history_endpoint(request: HistoryRequest):
    """
    履歴ファイルの内容をロードしてフロントに返す（GenAI APIに送信しない）
    画面表示用
    """
    try:
        history_data = load_history(request.project, request.phase, request.session_id)
        return history_data # オブジェクト全体を返す
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"履歴ロード失敗: {e}")


@app.post("/create_project")
def create_project_endpoint(request: CreateProjectRequest):
    """
    プロジェクト新規作成
    """
    try:
        created = create_project(request.project)
        return {"created": created, "project": request.project}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"プロジェクト作成に失敗: {e}")


@app.get("/projects")
def get_projects_endpoint():
    """
    既存プロジェクト一覧を取得
    """
    try:
        return {"projects": get_projects_list()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"プロジェクト一覧の取得に失敗: {e}")


@app.get("/projects/{project}/histories")
def get_histories_endpoint(project: str):
    """
    指定プロジェクトの履歴ファイル一覧を取得
    """
    try:
        return {"histories": get_histories_list(project)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"履歴一覧の取得に失敗: {e}")


@app.delete("/projects/{project}")
def remove_project_endpoint(project: str):
    """
    指定プロジェクトフォルダを削除
    """
    try:
        deleted = delete_project(project)
        return {"deleted": deleted, "project": project}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"プロジェクト削除に失敗: {e}")


@app.delete("/projects/{project}/histories/{phase}/{session_id}")
def remove_history_endpoint(project: str, phase: str, session_id: str):
    """
    指定された履歴ファイルを削除
    """
    try:
        deleted = delete_history(project, phase, session_id)
        if deleted:
            return {"deleted": True, "file": f"{phase}_{session_id}.json"}
        else:
            raise HTTPException(status_code=404, detail="History file not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"履歴ファイル削除に失敗しました: {e}")


@app.post("/reset_session")
async def reset_session_endpoint():
    """
    バックエンドのグローバルチャットセッションをリセットする
    """
    try:
        await create_or_resume_session(phase="default", history=None)
        return {"message": "Backend session reset successfully."}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"セッションのリセットに失敗しました: {e}")


# Add this block for uvicorn to run correctly with --reload on Windows
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)