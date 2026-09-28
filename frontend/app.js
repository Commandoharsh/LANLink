let socket = null;
let username = "";

const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("usernameInput");
const loginError = document.getElementById("loginError");

const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

const messagesContainer = document.getElementById("messages");

const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

const userList = document.getElementById("userList");
const userCount = document.getElementById("userCount");


/* Login */

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = usernameInput.value.trim();

    if (!name) {
        loginError.textContent = "Please enter a username.";
        return;
    }

    username = name;

    connectToServer();
});


/* Connect */

function connectToServer() {

    loginError.textContent = "";

    const protocol =
        window.location.protocol === "https:"
            ? "wss:"
            : "ws:";

    const wsUrl =
        `${protocol}//${window.location.host}/ws?username=${encodeURIComponent(username)}`;

    socket = new WebSocket(wsUrl);


    socket.onopen = function () {

        loginModal.style.display = "none";

        messageInput.disabled = false;
        sendButton.disabled = false;

        updateStatus(true);

        messageInput.focus();
    };


    socket.onmessage = function (event) {

        const data = JSON.parse(event.data);

        handleServerMessage(data);
    };


    socket.onclose = function () {

        messageInput.disabled = true;
        sendButton.disabled = true;

        updateStatus(false);
    };


    socket.onerror = function () {

        loginError.textContent =
            "Unable to connect to the server.";
    };
}


/* Handle server messages */

function handleServerMessage(data) {

    if (data.type === "message") {

        addMessage(
            data.username,
            data.message,
            data.timestamp
        );

    }

    else if (data.type === "system") {

        addSystemMessage(
            data.message,
            data.timestamp
        );

    }

    else if (data.type === "users") {

        updateUsers(data.users);

    }

    else if (data.type === "error") {

        loginError.textContent = data.message;

        loginModal.style.display = "flex";
    }
}


/* Send message */

messageForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const message = messageInput.value.trim();

    if (!message || !socket) {
        return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
        return;
    }

    socket.send(
        JSON.stringify({
            message: message
        })
    );

    messageInput.value = "";
    messageInput.focus();
});


/* Add message */

function addMessage(sender, message, timestamp) {

    const welcome = document.querySelector(".welcome-message");

    if (welcome) {
        welcome.remove();
    }

    const wrapper = document.createElement("div");

    wrapper.className =
        sender === username
            ? "message own"
            : "message";


    const content = document.createElement("div");
    content.className = "message-content";


    const info = document.createElement("div");
    info.className = "message-info";


    const name = document.createElement("span");
    name.className = "message-username";
    name.textContent = sender;


    const time = document.createElement("span");
    time.className = "message-time";
    time.textContent = timestamp;


    const text = document.createElement("div");
    text.className = "message-text";
    text.textContent = message;


    info.appendChild(name);
    info.appendChild(time);

    content.appendChild(info);
    content.appendChild(text);

    wrapper.appendChild(content);

    messagesContainer.appendChild(wrapper);

    scrollToBottom();
}


/* System message */

function addSystemMessage(message, timestamp) {

    const element = document.createElement("div");

    element.className = "system-message";

    element.textContent =
        `${message} • ${timestamp}`;

    messagesContainer.appendChild(element);

    scrollToBottom();
}


/* Update users */

function updateUsers(users) {

    userList.innerHTML = "";

    userCount.textContent = users.length;

    users.forEach(function (user) {

        const element = document.createElement("div");

        element.className = "user";


        const avatar = document.createElement("div");

        avatar.className = "user-avatar";

        avatar.textContent =
            user.charAt(0).toUpperCase();


        const name = document.createElement("span");

        name.className = "user-name";

        name.textContent = user;


        element.appendChild(avatar);
        element.appendChild(name);

        userList.appendChild(element);
    });
}


/* Connection status */

function updateStatus(connected) {

    if (connected) {

        statusDot.style.background = "#22c55e";
        statusText.textContent = "Connected";

    } else {

        statusDot.style.background = "#ef4444";
        statusText.textContent = "Disconnected";
    }
}


/* Scroll */

function scrollToBottom() {

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
}