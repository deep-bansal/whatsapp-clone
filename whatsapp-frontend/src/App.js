import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import "./App.css";
import axios from "./axios";
import { Sidebar, Chat, Login } from "./components";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    axios.get("/messages/sync").then((response) => {
      setMessages(response.data);
    });
  }, []);
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

  const [user, setUser] = useState(null);
  return (
    <div className="App">
      {!user ? (
        <Login />
      ) : (
        <div className="app_body">
          <Router>
            <Sidebar />
            <Switch>
              <Route exact path="/">
                <Chat messages={messages} />
              </Route>
              <Route path="/rooms/:roomId/:seed">
                <Chat messages={messages} />
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
