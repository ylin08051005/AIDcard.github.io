import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/css/demo.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss";
import Admin from "./views/Admin";
import Index from "./views/Index";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/admin" render={(props) => <Admin {...props} />} />
        <Route path="/" exact component={Index} />
        <Redirect from="*" to="/" />
      </Switch>
    </Router>
  );
}

export default App;
