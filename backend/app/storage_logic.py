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


def load_history(project: str, phase: str, session_id: str) -> dict:
    """
    指定の履歴ファイルを読み込み、ファイル全体のオブジェクトを返す。
    ファイル形式は{phase: str, messages: List[dict]}を想定。
    """
    path = _get_session_path(project, phase, session_id)
    if not path.exists() or os.path.getsize(path) == 0:
        return {"phase": phase, "messages": []}
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
            # 新しいオブジェクト形式の場合
            if isinstance(data, dict) and "messages" in data:
                return data
            else:
                # 形式が不正な場合は初期化
                return {"phase": phase, "messages": []}
    except Exception:
        return {"phase": phase, "messages": []}


def save_message(project: str, phase: str, session_id: str, role: str, text: str):
    """
    メッセージを履歴ファイルに対してGemini互換フォーマットで保存。
    ファイル全体を{phase: str, messages: List[dict]}の形式で保存する。
    """
    path = _get_session_path(project, phase, session_id)
    data = {"phase": phase, "messages": []}
    
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                # ファイルが壊れている場合は初期化
                data = {"phase": phase, "messages": []}

    new_message = {
        "role": role,
        "parts": [{"text": text}]
    }
    data["messages"].append(new_message)
    
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


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