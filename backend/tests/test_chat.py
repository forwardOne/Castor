import pytest
from fastapi.testclient import TestClient
from app.main import app

# TestClientインスタンスを作成
client = TestClient(app)

# 正常系はGeminiが生成し、異常系は自分で書いてみた

# `send_chat_message` SDKでAPI呼び出しを行う
# `save_message` ユーザー入力とAI応答を保存する
CHAT_LOGIC_PATH = "app.main.send_chat_message"
STORAGE_LOGIC_PATH = "app.main.save_message"

@pytest.mark.asyncio
async def test_chat_endpoint_success(mocker):
    """
    /chat エンドポイントの正常系テスト
    - 外部関数をモック化する
    - 正常なリクエストを送信し、200 OKが返ることを確認する
    - モック化した関数が正しく呼び出されることを確認する
    """
    # --- モックの設定 ---
    # send_chat_message をモック化し、固定の応答を返すように設定
    mock_send_chat = mocker.patch(CHAT_LOGIC_PATH, return_value="AIの応答メッセージ")
    
    # save_message をモック化
    mock_save_message = mocker.patch(STORAGE_LOGIC_PATH)
    
    # --- テストデータ ---
    test_request_body = {
        "message": "テストメッセージ",
        "project": "test_project",
        "phase": "test_phase",
        "session_id": "test_session_123"
    }
    
    # --- リクエストの実行 ---
    # /chat エンドポイントにPOSTリクエストを送信
    # TestClientは非同期エンドポイントも同期的に呼び出せる
    response = client.post("/chat", json=test_request_body)
    
    # --- 検証 ---
    # ステータスコードが200 OKであることを確認
    assert response.status_code == 200
    
    # レスポンスボディが期待通りであることを確認
    assert response.json() == {"response": "AIの応答メッセージ"}
    
    # --- モックの呼び出し検証 ---
    # send_chat_message が1回、指定されたメッセージで呼び出されたことを確認
    mock_send_chat.assert_called_once_with(message="テストメッセージ")
    
    # save_message が2回呼び出されたことを確認（ユーザーメッセージとAI応答）
    assert mock_save_message.call_count == 2
    
    # 1回目の呼び出し（ユーザーメッセージ）の引数を確認
    mock_save_message.call_args_list[0].assert_called_with(
        "test_project", "test_phase", "test_session_123", "user", "テストメッセージ"
    )
    # 2回目の呼び出し（AI応答）の引数を確認
    mock_save_message.call_args_list[1].assert_called_with(
        "test_project", "test_phase", "test_session_123", "model", "AIの応答メッセージ"
    )


@pytest.mark.asyncio
async def test_chat_endpoint_invalid_body(mocker):
    """
    /chat エンドポイントの異常系テスト
    - 不正なリクエストボディ
    - messageフィールドが欠落している場合、400 Bad Requestが返ることを確認する
    """
    # --- テストデータ ---
    invalid_request_body = {
        "project": "test_project",
        "phase": "test_phase",
        "session_id": "test_session_123"
        # "message" フィールドが欠落
    }
    
    # --- リクエストの実行 ---
    response = client.post("/chat", json=invalid_request_body)
    
    # --- 検証 ---
    # ステータスコードが400 Bad Requestであることを確認
    assert response.status_code == 422  # FastAPIはバリデーションエラーで422を返す
    
    # エラーメッセージに 'message' フィールドの欠落が含まれていることを確認
    assert "message" in response.json()["detail"][0]["loc"]