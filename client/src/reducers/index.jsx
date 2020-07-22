import { combineReducers } from "redux";
import account from "./account";
import employee from "./employee";

export default combineReducers({ account, employee });
