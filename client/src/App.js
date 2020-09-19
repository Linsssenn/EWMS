import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import NavRoute from "./hoc/NavRoute";
import PrivateRoute from "./hoc/PrivateRoute";
import Spinner from "./components/Spinner";

// Code Splitting
// Make a dynamic import use only if the Route is requested by the client
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const NearestEmployee = lazy(() => import("./pages/NearestEmployee"));
const NearestDetachment = lazy(() => import("./pages/NeareastDetachment"));
const Employee = lazy(() => import("./pages/Employee"));
const Detachment = lazy(() => import("./pages/Detachment"));

const NotFound = () => <div>Not Found</div>;

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner content="" />}>
        <Switch>
          <Route exact path="/" component={Login} />

          <PrivateRoute exact path="/home" component={Home} />
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
