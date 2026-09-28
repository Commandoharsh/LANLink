# 💬 NetChat

### Real-Time LAN Messaging Application

NetChat is a lightweight, real-time messaging application designed for communication between multiple users connected to the **same local area network (LAN)**.

The application uses **Python, FastAPI, WebSockets, HTML, CSS, and JavaScript** to provide instant communication without requiring an external messaging service or cloud server.

Users can connect to a single host computer through its local IP address, choose a username, and exchange messages in real time.

---

## 🚀 Features

### 💬 Real-Time Messaging

Messages are delivered instantly using **WebSockets**, providing persistent two-way communication between the client and server.

### 👥 Multiple Users

Multiple users can connect to the same server simultaneously.

### 🟢 Online User List

The sidebar displays currently connected users and automatically updates when users join or leave.

### 👤 Username System

Users choose a username before entering the chat.

The application prevents two connected users from using the same username.

### 🕒 Message Timestamps

Every message displays the time at which it was received by the server.

### 🔔 Join and Leave Notifications

The application displays system notifications when users join or leave the chat.

### 🌐 LAN Communication

The server can listen on all network interfaces, allowing other devices connected to the same Wi-Fi or Ethernet network to connect.

### 📱 Responsive Interface

The frontend adapts to smaller screens and provides a simplified interface on mobile devices.

### 🛡️ Basic Validation

The application validates:

* Username length
* Empty usernames
* Duplicate usernames
* Empty messages
* Maximum message length
* Invalid WebSocket connections

### ❤️ Health Endpoint

A simple health endpoint provides the server status and number of connected users.

---

# 🏗️ Architecture

NetChat follows a simple **client-server architecture**.

```text
                    Local Network
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
     ┌─────────┐    ┌─────────┐    ┌─────────┐
     │ Client  │    │ Client  │    │ Client  │
     │ Browser │    │ Browser │    │ Browser │
     └────┬────┘    └────┬────┘    └────┬────┘
          │              │              │
          │   WebSocket  │   WebSocket  │
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                 ┌───────────────┐
                 │  FastAPI      │
                 │    Server     │
                 ├───────────────┤
                 │ Connection    │
                 │ Manager       │
                 ├───────────────┤
                 │ Message       │
                 │ Broadcasting  │
                 └───────────────┘
```

The server maintains a collection of active WebSocket connections.

When one user sends a message:

```text
User A
   │
   │ Message
   ▼
WebSocket
   │
   ▼
FastAPI Server
   │
   │ Broadcast
   ├───────────────┐
   ▼               ▼
User B          User C
```

---

# 🧠 Networking Concepts Demonstrated

This project is designed to demonstrate practical networking concepts.

## 1. Client-Server Architecture

The FastAPI application acts as the central server.

Every client connects to the server rather than directly communicating with another client.

```text
Client → Server → Clients
```

---

## 2. WebSockets

NetChat uses WebSockets for real-time communication.

Unlike traditional HTTP requests, a WebSocket connection remains open:

```text
Client
  │
  │ WebSocket Handshake
  ▼
Server
  │
  │ Persistent Connection
  │◄────────────────────►│
```

This allows the server to push messages to connected clients immediately.

---

## 3. TCP-Based Communication

WebSockets operate over TCP, providing reliable and ordered communication between the client and server.

---

## 4. IP Addressing

The server binds to:

```text
0.0.0.0
```

This tells the operating system to listen on available network interfaces.

A device on the same network can then connect using the host machine's private IP address.

For example:

```text
192.168.1.105:8000
```

---

## 5. JSON Communication

Messages between the browser and server are transferred using JSON.

Example:

```json
{
    "message": "Hello everyone!"
}
```

The server broadcasts messages in a structured format:

```json
{
    "type": "message",
    "username": "Harsh",
    "message": "Hello everyone!",
    "timestamp": "10:42"
}
```

---

## 6. Connection Management

The backend maintains active WebSocket connections.

Conceptually:

```python
{
    websocket_connection_1: "Harsh",
    websocket_connection_2: "Alex",
    websocket_connection_3: "John"
}
```

When a user disconnects, their connection is removed.

---

# 🛠️ Technology Stack

## Backend

| Technology | Purpose                 |
| ---------- | ----------------------- |
| Python     | Backend programming     |
| FastAPI    | Web framework           |
| WebSockets | Real-time communication |
| Uvicorn    | ASGI server             |
| Pydantic   | Data validation         |

## Frontend

| Technology | Purpose                              |
| ---------- | ------------------------------------ |
| HTML5      | Application structure                |
| CSS3       | Styling and responsive UI            |
| JavaScript | WebSocket communication and UI logic |

## Testing

| Technology | Purpose           |
| ---------- | ----------------- |
| Pytest     | Automated testing |

---

# 📁 Project Structure

```text
NetChat/
│
├── backend/
│   ├── __init__.py
│   ├── main.py
│   ├── connection_manager.py
│   └── models.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── tests/
│   └── test_models.py
│
├── pytest.ini
├── requirements.txt
├── README.md
└── .gitignore
```

---

# 📂 Backend

## `backend/main.py`

The main FastAPI application.

Responsibilities include:

* Starting the FastAPI application
* Serving the frontend
* Creating the WebSocket endpoint
* Accepting users
* Validating usernames
* Handling messages
* Broadcasting messages
* Handling disconnections
* Providing the health endpoint

Main WebSocket endpoint:

```text
/ws
```

---

## `backend/connection_manager.py`

Responsible for managing connected clients.

Main responsibilities:

```text
Connect user
      ↓
Store WebSocket connection
      ↓
Track username
      ↓
Broadcast messages
      ↓
Detect disconnected users
      ↓
Remove connection
```

---

## `backend/models.py`

Contains Pydantic models used for data validation.

Example:

```python
class ChatMessage(BaseModel):
    username: str
    message: str
```

---

# 🎨 Frontend

## `frontend/index.html`

Contains the application interface:

* Login screen
* Username input
* Chat area
* Online user list
* Message input
* Send button
* Connection status

---

## `frontend/style.css`

Responsible for:

* Layout
* Colors
* Message bubbles
* Sidebar
* Login modal
* Responsive design
* Connection status indicators

---

## `frontend/app.js`

Handles frontend functionality.

Responsibilities include:

* Establishing WebSocket connections
* Sending messages
* Receiving messages
* Updating the UI
* Updating online users
* Displaying system messages
* Displaying connection status
* Automatically scrolling to new messages

---

# ⚙️ Installation

## Requirements

Make sure you have:

* Python 3.10+
* pip
* A modern web browser
* Local network connection for multi-device testing

Python 3.10 or newer is recommended.

---

## 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Enter the project:

```bash
cd NetChat
```

---

## 2. Create a virtual environment

Windows:

```powershell
python -m venv .venv
```

Activate it:

```powershell
.\.venv\Scripts\Activate.ps1
```

Linux/macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

---

## 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

# ▶️ Running the Application

Start the FastAPI server:

```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

The server will display something similar to:

```text
Uvicorn running on http://0.0.0.0:8000
```

### Important

`0.0.0.0` is the address used by the server to listen on network interfaces.

Do **not** normally enter:

```text
http://0.0.0.0:8000
```

into your browser.

Instead, on the host computer use:

```text
http://localhost:8000
```

or:

```text
http://127.0.0.1:8000
```

---

# 🌐 Connecting From Another Device

NetChat can be used by other devices on the same LAN.

## Step 1 — Find the host IP

On Windows:

```powershell
ipconfig
```

Find the IPv4 address of the active network adapter.

Example:

```text
IPv4 Address. . . . . . : 192.168.1.105
```

---

## Step 2 — Start NetChat

On the host computer:

```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

---

## Step 3 — Connect from another device

On another device connected to the same network, open:

```text
http://192.168.1.105:8000
```

Replace the IP with the actual IP address of the host computer.

---

# 🔥 Example LAN Setup

Suppose the host computer has:

```text
IP Address:
192.168.1.105

Port:
8000
```

Then:

```text
Host Computer
       │
       │
192.168.1.105:8000
       │
       ├───────────────┐
       │               │
       ▼               ▼
 Laptop             Phone
192.168.1.20       192.168.1.30
```

All devices must be connected to the same local network.

---

# 🔌 WebSocket Communication

The browser establishes a WebSocket connection using:

```text
ws://<server-ip>:8000/ws?username=<username>
```

For example:

```text
ws://192.168.1.105:8000/ws?username=Harsh
```

Once connected, the connection remains active.

---

# 📡 Message Flow

When a user sends:

```text
Hello!
```

the browser sends:

```json
{
    "message": "Hello!"
}
```

The FastAPI server receives the message and broadcasts:

```json
{
    "type": "message",
    "username": "Harsh",
    "message": "Hello!",
    "timestamp": "10:45"
}
```

Every connected client receives the message.

---

# 👥 User Management

When a new user joins:

```text
Harsh joined the chat.
```

The server broadcasts a system event.

The user list is also updated:

```json
{
    "type": "users",
    "users": [
        "Harsh",
        "Alex",
        "John"
    ]
}
```

When a user disconnects:

```text
John left the chat.
```

The server removes their WebSocket connection and updates all clients.

---

# ❤️ Health Check

NetChat provides a simple health endpoint.

Open:

```text
http://localhost:8000/health
```

Example response:

```json
{
    "status": "online",
    "users": 2
}
```

This can be useful for monitoring whether the server is running.

---

# 🧪 Testing

Run the automated tests:

```bash
python -m pytest -q
```

Example:

```text
2 passed
```

The current tests verify the basic Pydantic models used by the application.

---

# 🔒 Current Security Model

NetChat is designed primarily as a **local-network demonstration and learning project**.

The current implementation does not provide:

* User authentication
* Passwords
* End-to-end encryption
* TLS/WSS
* Persistent message encryption
* Role-based access control
* Rate limiting

Therefore, it should not be treated as a production-grade private messaging platform.

For normal experimentation, keep it within a trusted local network.

---

