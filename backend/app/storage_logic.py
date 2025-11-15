# backend/storage_logic.py
# CRUD
import os
import json
import shutil
from typing import List
from pathlib import Path

CHAT_SESSIONS_PATH = Path(__file__).parent.parent / "chat_sessions"
CHAT_SESSIONS_PATH.mkdir(exist_ok=True)


# --- Definitions ---
def create_project(project: str) -> bool:
    """
    新規プロジェクトフォルダを作成。既に存在する場合は何もしない
    """
    path = CHAT_SESSIONS_PATH / project
    path.mkdir(parents=True, exist_ok=True)
    return True


def _get_session_path(project: str, phase: str, session_id: str) -> Path:
    """
    セッションファイルパスを取得。プロジェクトフォルダが無ければ作成
    冗長的対応だが安全策をとる
    """
    path = CHAT_SESSIONS_PATH / project
    path.mkdir(parents=True, exist_ok=True)
    return path / f"{phase}_{session_id}.json"


def get_projects_list() -> List[str]:
    """
    既存プロジェクト一覧を取得
    """
    return [p.name for p in CHAT_SESSIONS_PATH.iterdir() if p.is_dir()]


def get_histories_list(project: str) -> List[str]:
    """
    既存プロジェクト内の履歴ファイル一覧を取得
    """
    path = CHAT_SESSIONS_PATH / project
    if not path.exists():
        return []
    return [f.name for f in path.glob("*.json")]


def load_history(project: str, phase: str, session_id: str) -> List[dict]:
    """
    指定の履歴ファイルを読み込み、Gemini互換フォーマットで返す
    """
    path = _get_session_path(project, phase, session_id)
    if not path.exists():
        return []
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f) #保存段階で互換フォーマットに変えたのでそのまま読む
    except Exception:
        return []


def save_message(project: str, phase: str, session_id: str, role: str, text: str):
    """
    メッセージを履歴ファイルに対してGemini互換フォーマットで保存。
    """
    path = _get_session_path(project, phase, session_id)
    messages = []
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            try:
                messages = json.load(f)
            except json.JSONDecodeError:
                messages = []
    
    new_message = {
        "role": role,
        "parts": [{"text": text}] #保存段階で互換フォーマットに変えた
    }
    messages.append(new_message)
    
    with open(path, "w", encoding="utf-8") as f:
        json.dump(messages, f, ensure_ascii=False, indent=2)


def delete_project(project: str) -> bool:
    """
    プロジェクトフォルダを中の履歴ファイルごと削除
    """
    path = CHAT_SESSIONS_PATH / project
    shutil.rmtree(path)
    return True


def delete_history(project: str, session_id: str) -> bool:
    """
    指定プロジェクト内の履歴ファイルを削除
    """
    path = CHAT_SESSIONS_PATH / project / session_id
    os.remove(path)
    return True