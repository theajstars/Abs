import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";

ReactDOM.render(
  <Router>
    <Route exact path="/" component={App} />
    <Route exact path="/register" component={Register} />
    <Route exact path="/login" component={Login} />
  </Router>,
  document.getElementById("root")
);
