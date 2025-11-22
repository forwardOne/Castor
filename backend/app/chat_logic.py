# backend/chat_logic.py
# Gemini API Call by Google GenAI Python SDK
import os
import json
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types
from .storage_logic import load_history
import asyncio
from typing import List

load_dotenv()

# --- Gemini ---
GEMINI_MODEL = "gemini-2.5-flash"

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key or api_key == "YOUR_API_KEY_FROM_GOOGLE_AI_STUDIO":
    raise ValueError("APIキーが.envファイルに設定されていないか、無効です。")

client = genai.Client(api_key=api_key) # async_client = client.aio を使うか検討中
chat = None
chat_lock = asyncio.Lock()


# --- PromptConfigs ---
CONFIG_FILE_PATH = Path(__file__).parent.parent / "gemini_configs.json"
GEMINI_CONFIGS = {}
try:
    with open(CONFIG_FILE_PATH, 'r', encoding='utf-8') as f:
        GEMINI_CONFIGS = json.load(f)
    print("Gemini Configs loaded successfully.")
except FileNotFoundError:
    print(f"ERROR: Config file not found at {CONFIG_FILE_PATH}.")
except json.JSONDecodeError:
    print(f"ERROR: Config file is not valid JSON.")


# --- Definitions ---
def get_generation_content_config(phase: str):
    """
    フェーズに応じて、GenerateContentConfigを取得
    """
    config_data = GEMINI_CONFIGS.get(phase, GEMINI_CONFIGS.get("default", {}))
    tools_list = []
    if "google_search" in config_data.get("tools", []):
        tools_list.append(types.Tool(google_search=types.GoogleSearch()))

    generate_content_config = types.GenerateContentConfig(
        temperature=config_data.get("temperature", 0.5),
        thinking_config=types.ThinkingConfig(thinking_budget=-1),
        tools=tools_list,
        response_mime_type=config_data.get("response_mime_type", "text/plain"),
        system_instruction=config_data.get(
            "system_instruction",
            "あなたは丁寧で正確な情報を提供するアシスタントです。ユーザーの質問には経験豊富なセキュリティアナリスト兼CTFコーチとして応じます。セキュリティやハッキングに関する話題の場合はユーザー教育を意識した回答をしてください。必要に応じて最新情報にアクセスしてください。回答はマークダウン形式でお願いします。"
        ),
    )
    return generate_content_config


async def create_or_resume_session(phase: str, history: List[dict] = None):
    """
    グローバルなチャットセッションを新規作成、または履歴で再構築する。
    セッションが切り替わる3つのイベント（起動時、新規チャット、再開時）で使用する。
    """
    global chat
    
    # フェーズに応じた設定を取得
    config = get_generation_content_config(phase)
    
    async with chat_lock:
        # 履歴があれば、それを渡してセッションを再構築
        # historyがNoneや空リストの場合は、新しいセッションとして動作する
        chat = client.aio.chats.create(
            model=GEMINI_MODEL,
            config=config,
            history=history or [],  # 履歴がNoneや空リストの場合は空のリストを渡す
        )        
    if history:
        print(f"Chat session resumed with {len(history)} messages.")
    else:
        print("New chat session initialized.")


async def init_chat_on_startup():
    """
    起動時初期セッション開始。
    """
    await create_or_resume_session(phase="default") 
    print("Chat session initialized.")


def reset_chat():
    """
    チャットセッションリセット
    """
    global chat
    chat = client.aio.chats.create(model=GEMINI_MODEL)
    print("Chat session reset.")


async def send_chat_message(message: str):
    """
    メッセージ送信、応答取得、非SSE
    履歴保存はエンドポイント側
    """
    global chat
    async with chat_lock:
        response = await chat.send_message(message)
        return response.text

