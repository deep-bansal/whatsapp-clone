import React from "react";
import "./App.css";
import { Sidebar, Chat } from "./components";

function App() {
  return (
    <div className='App'>
      <div className='app_body'>
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}

export default App;
