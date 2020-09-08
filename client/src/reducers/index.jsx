import { combineReducers } from "redux";
import account from "./account";
import employee from "./employee";
import detachment from "./detachment";

export default combineReducers({ account, employee, detachment });
