import { ACCOUNT } from "../actions/types";
import fetchStates from "./fetchStates";

const DEFAULT_ACCOUNT = { loggedIn: false };

const account = (state = DEFAULT_ACCOUNT, action) => {
  switch (action.type) {
    case ACCOUNT.FETCH:
      return { ...state, status: fetchStates.fetching };

    default:
      return state;
  }
};

export default account;
