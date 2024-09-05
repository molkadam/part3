import React, { useState, useEffect, useRef } from "react";
import { Alert } from "react-bootstrap";
import { userGetById } from "../Services/UserServices";
import { addMessage, getMessages } from "../Services/ChatService";
import moment from "moment";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [error, setError] = useState("");
  const loggedin = JSON.parse(localStorage.getItem("loggdin"));
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  const getUserName = async (uid) => {
    try {
      const user = await userGetById(uid);
      return user ? user.name : "Unknown User";
    } catch (error) {
      console.error("Error fetching user:", error);
      return "Unknown User";
    }
  };

  useEffect(() => {
    if (userId) {
      getUserName(userId).then(setUsername);
    }
  }, [userId]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await getMessages();
        const messagesWithUsernames = await Promise.all(
          fetchedMessages.map(async (message) => {
            const name = await getUserName(message.uid);
            return { ...message, username: name };
          })
        );
        setMessages(messagesWithUsernames);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  const handleRefresh = async () => {
    try {
      const updatedMessages = await getMessages();
      const messagesWithUsernames = await Promise.all(
        updatedMessages.map(async (message) => {
          const name = await getUserName(message.uid);
          return { ...message, username: name };
        })
      );
      setMessages(messagesWithUsernames);
    } catch (error) {
      console.error("Error refreshing messages:", error);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (messageInput.trim() === "") {
      setError("Message cannot be empty");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const newMessage = {
      id: Date.now(),
      uid: userId,
      message: messageInput,
      timestamp: Date.now(),
    };

    try {
      const response = await addMessage(newMessage);
      console.log(response);
      if (response) {
        try {
          const updatedMessages = await getMessages();
          const messagesWithUsernames = await Promise.all(
            updatedMessages.map(async (message) => {
              const name = await getUserName(message.uid);
              return { ...message, username: name };
            })
          );
          setMessages(messagesWithUsernames);
        } catch (error) {
          console.error("Error getting messages:", error);
        }
      }
    } catch (error) {
      console.error("Error adding message:", error);
    }
    setMessageInput("");
  };

  return (
    <div className="chat-box-container container">
      <h1 className="text-center">Group Chat</h1>
      <div className="chat-box">
        <div id="messages" className="message-container mb-3">
          {messages &&
            messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`message ${
                    message.uid === userId ? "own-message" : "other-message"
                  }`}
                >
                  <div className="message-header">
                    <span className="activeUser">{message.username}</span>
                    <span className="timestamp">
                      {moment(Number(message.timestamp)).format('D-MMM-YYYY h:mm A')}
                    </span>
                  </div>
                  <div className="message-body">{message.message}</div>
                </div>
                <div className="clearfix"></div>
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="input-section">
          <label htmlFor="messageInput" className="user-label">
            {username}
          </label>
          <input
            className="form-control message-input"
            type="text"
            id="messageInput"
            placeholder="Type a message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <div className="button-group">
            <button className="btn btn-info rounded-0" onClick={handleRefresh}>
              Refresh
            </button>
            <button
              className="btn btn-primary rounded-0"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
