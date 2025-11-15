# backend/app/schemas.py

from pydantic import BaseModel

# 同一名フィールドを扱うが、扱うオブジェクト数が異なるため複数クラスで定義している
class ChatRequest(BaseModel):
    project: str
    phase: str
    session_id: str
    message: str


class HistoryRequest(BaseModel):
    project: str
    phase: str
    session_id: str


class CreateProjectRequest(BaseModel):
    project: str


class NewSessionRequest(BaseModel):
    project: str
    phase: str