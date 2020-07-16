import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NearestEmployee from "./pages/NearestEmployee";
import Employee from "./pages/Employee";
import NavRoute from "./hoc/NavRoute";

const NotFound = () => <div>Not Found</div>;

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <NavRoute path="/dashboard" component={Dashboard} />
        <NavRoute path="/nearest-employee" component={NearestEmployee} />
        <NavRoute path="/employee" component={Employee} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
