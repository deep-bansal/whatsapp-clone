import React, { useState } from "react";
import "./App.css";
import { Sidebar, Chat, Login, Formal } from "./components";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const addUser = (User) => {
    setUser(User);
    console.log(User);
  };
  return (
    <div className="App">
      {!user ? (
        <Login addUser={addUser} />
      ) : (
        <div className="app_body">
          <Router>
            <Sidebar user={user} />
            <Switch>
              <Route exact path="/">
                <Formal />
              </Route>
              <Route path="/rooms/:roomId/:seed">
                <Chat user={user} />
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
