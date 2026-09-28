from backend.models import ChatMessage, UserJoin


def test_chat_message():

    message = ChatMessage(
        username="Harsh",
        message="Hello!"
    )

    assert message.username == "Harsh"
    assert message.message == "Hello!"


def test_user_join():

    user = UserJoin(
        username="Harsh"
    )

    assert user.username == "Harsh"