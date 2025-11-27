# 様々を参考にしてテストコードを自分で書いてみた。
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    """
    ルートエンドポイント ("/") のテスト
    - ステータスコードが200であること
    - レスポンスボディが期待通りであること
    を確認する
    """
    # ルートエンドポイントにGETリクエストを送信
    response = client.get("/")
    
    # ステータスコードが200 OKであることを確認
    assert response.status_code == 200
    
    # レスポンスのJSONボディが期待通りであることを確認
    assert response.json() == {"message": "Castor Backend is running."}
