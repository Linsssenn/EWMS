import { EMPLOYEE } from "../actions/types";
import fetchStates from "./fetchStates";

const DEFAULT_EMPLOYEE = {
  employees: [],
  employee: {},
};

const employee = (state = DEFAULT_EMPLOYEE, action) => {
  switch (action.type) {
    case EMPLOYEE.FETCH:
      return { ...state, status: fetchStates.fetching };

    case EMPLOYEE.FETCH_ERROR:
      return { ...state, status: fetchStates.error, message: action.message };
    case EMPLOYEE.FETCH_SUCCESS:
      return {
        ...state,
        status: fetchStates.success,
        message: action.message,
        employees: action.data,
        count: action.count,
      };
    case EMPLOYEE.GET:
      return {
        ...state,
        status: fetchStates.success,
        message: action.message,

        employee: action.data,
      };
    case EMPLOYEE.ADD:
      const { result, info, address } = action;
      const addedEmployee = { id: result.id, ...info, ...address };
      return {
        ...state,
        employees: [addedEmployee, ...state.employees],
        status: fetchStates.success,
        message: result.message,
      };
    default:
      return state;
  }
};

export default employee;
