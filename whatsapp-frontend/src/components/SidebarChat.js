import { Avatar } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "../styles/sidebarChat.css";
import { Link } from "react-router-dom";
import axios from "../axios";

function SidebarChat({ id, name, addNewChat }) {
  const [seed, setSeed] = useState("");
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);
  const createChat = async (e) => {
    e.preventDefault();
    const roomName = prompt("Please enter name for chat");
    if (roomName) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axios.post(
        "/rooms/new",
        {
          name: roomName,
        },
        config
      );
    }
  };
  return !addNewChat ? (
    <Link to={`/rooms/${id}/${seed}`}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebarChat_info">
          <h2>{name}</h2>
          <p>This is last messages</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={(e) => createChat(e)} className="sidebarChat">
      <h2>Add new Chat</h2>
    </div>
  );
}

export default SidebarChat;
