import { ACCOUNT } from "../actions/types";

const auth = (store) => (next) => (action) => {
  if (
    action.message === "You are not logged in! Please get login to get access"
  ) {
    console.log(
      action.message === "You are not logged in! Please get login to get access"
    );
    store.dispatch({
      type: ACCOUNT.FETCH_LOGOUT_SUCCESS,
    });
    return next(action);
  }
  return next(action);
};

export default auth;
