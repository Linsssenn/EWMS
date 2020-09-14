import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NearestEmployee from "./pages/NearestEmployee";
import Employee from "./pages/Employee";
import Detachment from "./pages/Detachment";
// import NavRoute from "./hoc/NavRoute";
import PrivateRoute from "./hoc/PrivateRoute";

// import { useDispatch, useSelector } from "react-redux";

const NotFound = () => <div>Not Found</div>;

function App() {
  // const auth = useSelector((state) => state.account);
  // const dispatch = useDispatch();
  // React.useEffect(() => {
  //   console.log("Authenticated Run");
  //   dispatch(fetchAuthenticated());
  // }, [dispatch]);

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
        <PrivateRoute exact path="/employee" component={Employee} />

        <PrivateRoute exact path="/detachment" component={Detachment} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
