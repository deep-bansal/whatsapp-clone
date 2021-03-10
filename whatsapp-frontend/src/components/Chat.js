import { Avatar, IconButton } from "@material-ui/core";
import {
  AttachFile,
  InsertEmoticon,
  MicOutlined,
  MoreVert,
  SearchOutlined,
} from "@material-ui/icons";
import axios from "../axios";
import Pusher from "pusher-js";
import React, { useEffect, useState } from "react";
import "../styles/chat.css";
import { useParams } from "react-router-dom";

function Chat({ user }) {
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const { seed } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (roomId) {
      axios.get(`messages/sync/${roomId}`).then((response) => {
        setMessages(response.data);
      });
    }
  }, [roomId]);
  useEffect(() => {
    const pusher = new Pusher("1c8efe6427d0e8bf5a05", {
      cluster: "eu",
    });
    const channel = pusher.subscribe("messages");
    channel.bind("inserted", function (newMessage) {
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  useEffect(() => {
    if (roomId) {
      axios.get(`/room/${roomId}`).then((response) => {
        setRoomName(response.data[0].name);
      });
    }
  }, [roomId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    var currentdate = new Date();
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.post(
      "messages/new",
      {
        message: input,
        name: user.displayName,
        timestamp: currentdate.getHours() + ":" + currentdate.getMinutes(),
        received: user.email,
        roomId: roomId,
      },
      config
    );
    setInput("");
  };
  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat_headerInfo">
          <h3>{roomName}</h3>
          <p>Last seen at..</p>
        </div>
        <div className="chat_headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat_body">
        {messages.map((message, idx) => {
          return (
            <p
              key={idx}
              className={`chat_message ${
                message.received === user.email ? "chat_receiver" : ""
              }`}
            >
              <span className="chat_name">{message.name}</span>
              {message.message}
              <span className="chat_timestamp">{message.timestamp}</span>
            </p>
          );
        })}
      </div>
      <div className="chat_footer">
        <IconButton>
          <InsertEmoticon />
        </IconButton>
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <MicOutlined />
      </div>
    </div>
  );
}

export default Chat;
