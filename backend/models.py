from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    username: str = Field(min_length=1, max_length=30)
    message: str = Field(min_length=1, max_length=500)


class UserJoin(BaseModel):
    username: str = Field(min_length=1, max_length=30)