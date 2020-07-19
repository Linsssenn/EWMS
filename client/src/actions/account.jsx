import { ACCOUNT } from "./types";

export const fetchFromAccount = ({
  endpoint,
  options,
  FETCH_TYPE,
  ERROR_TYPE,
  SUCCES_TYPE,
}) => {
  return (dispatch) => {
    dispatch({ type: FETCH_TYPE });

    return fetch(`/api/v1${endpoint}`, options)
      .then((response) => response.json())
      .then((json) => {
        if (json.status === "fail" || json.status === "error") {
          dispatch({ type: ERROR_TYPE, message: json.message });
        } else {
          dispatch({ type: SUCCES_TYPE, message: json.message, ...json });
        }
      })
      .catch((error) => {
        dispatch({
          type: ERROR_TYPE,
          message: error.message,
        });
      });
  };
};

export const login = ({ username, password }) =>
  fetchFromAccount({
    endpoint: "/account/login",
    options: {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
    },
    FETCH_TYPE: ACCOUNT.FETCH,
    ERROR_TYPE: ACCOUNT.FETCH_ERROR,
    SUCCES_TYPE: ACCOUNT.FETCH_SUCCESS,
  });

export const logout = () =>
  fetchFromAccount({
    endpoint: "/account/logout",
    options: { credentials: "same-origin" },
    FETCH_TYPE: ACCOUNT.FETCH,
    ERROR_TYPE: ACCOUNT.FETCH_ERROR,
    SUCCES_TYPE: ACCOUNT.FETCH_LOGOUT_SUCCESS,
  });

export const fetchAuthenticated = () =>
  fetchFromAccount({
    endpoint: "/account/authenticated",
    options: { credentials: "same-origin" },
    FETCH_TYPE: ACCOUNT.FETCH,
    ERROR_TYPE: ACCOUNT.FETCH_ERROR,
    SUCCES_TYPE: ACCOUNT.FETCH_AUTHENTICATED_SUCCESS,
  });
