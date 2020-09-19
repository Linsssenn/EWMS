import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NearestEmployee from "./pages/NearestEmployee";
import NearestDetachment from "./pages/NeareastDetachment";
import Employee from "./pages/Employee";
import Detachment from "./pages/Detachment";
// import NavRoute from "./hoc/NavRoute";
import PrivateRoute from "./hoc/PrivateRoute";

const NotFound = () => <div>Not Found</div>;

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />

        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute
          exact
          path="/detachment/nearest-employee"
          component={NearestEmployee}
        />
        <PrivateRoute
          exact
          path="/employee/nearest-detachment"
          component={NearestDetachment}
        />
        <PrivateRoute exact path="/employee" component={Employee} />

        <PrivateRoute exact path="/detachment" component={Detachment} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
