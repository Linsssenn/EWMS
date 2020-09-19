import React from "react";
import "./index.css";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { render } from "react-dom";

import "semantic-ui-css/semantic.min.css";

// Leaflet and plugins
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder";
import "react-leaflet-markercluster/dist/styles.min.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Redux
import { createStore } from "redux";
import { Provider } from "react-redux";
import middleware from "./middleware";
import reducer from "./reducers";

import { fetchAuthenticated } from "./actions/account";

const store = createStore(reducer, middleware);
store.dispatch(fetchAuthenticated()).then(() => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root")
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
