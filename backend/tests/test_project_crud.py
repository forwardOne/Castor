# 自分で書いたテストコード
import pytest
from fastapi.testclient import TestClient
from app.main import app

# TestClientインスタンスを作成
client = TestClient(app)

STORAGE_LOGIC_CREATE_PROJECT_PATH = "app.main.create_project"
STORAGE_LOGIC_GET_PROJECT_PATH = "app.main.get_projects_list"
STORAGE_LOGIC_DELETE_PROJECT_PATH = "app.main.delete_project"

def test_create_project_success(mocker):
    """
    /create_project エンドポイントの正常系テスト
    - storage_logic.create_project をモック化する
    """
    # --- モックの設定 ---
    # create_project をモック化し、Trueを返すように設定
    mock_create_project = mocker.patch(
        STORAGE_LOGIC_CREATE_PROJECT_PATH, return_value=True
    )
    
    # --- テストデータ ---
    test_request_body = {"project": "new_test_project"}
    
    # --- リクエストの実行 ---
    response = client.post("/create_project", json=test_request_body)
    
    # --- 検証 ---
    # ステータスコードが200 OKであることを確認
    assert response.status_code == 200
    
    # レスポンスボディが期待通りであることを確認
    assert response.json() == {"created": True, "project": "new_test_project"}
    
    # --- モックの呼び出し検証 ---
    # create_project が1回、指定されたプロジェクト名で呼び出されたことを確認
    mock_create_project.assert_called_once_with("new_test_project")


def test_get_projects_list_success(mocker):
    """
    /projects エンドポイントの正常系テスト
    - storage_logic.get_projects_list をモック化する
    """
    
    mock_get_projects_list = mocker.patch(
        STORAGE_LOGIC_GET_PROJECT_PATH, return_value=["project1", "project2"]
    )
    
    response = client.get("/projects")
    assert response.status_code == 200
    assert response.json() == {"projects": ["project1", "project2"]}
    
    mock_get_projects_list.assert_called_once()


def test_delete_project_success(mocker):
    """
    /projects/{project} エンドポイントの正常系テスト (DELETE)
    - storage_logic.delete_project をモック化する
    """
    
    mock_delete_project = mocker.patch(
        STORAGE_LOGIC_DELETE_PROJECT_PATH, return_value=True
    )
    
    project_to_delete = "delete_test_project"
    
    response = client.delete(f"/projects/{project_to_delete}")
    assert response.status_code == 200
    assert response.json() == {"deleted": True, "project": project_to_delete}
    
    mock_delete_project.assert_called_once_with(project_to_delete)