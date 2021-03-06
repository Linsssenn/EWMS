import { EMPLOYEE } from "./types";
import { fetchFromAccount } from "./account";
import fetchApi from "../util/fetchApi";

function addEmployee(info, address, result) {
  return {
    type: EMPLOYEE.ADD,
    info,
    address,
    result,
  };
}

function getDetachment(employeeId, result) {
  return {
    type: EMPLOYEE.GET_DETACHMENT,
    employeeId,
    result,
  };
}

export function clearDetachments() {
  return { type: EMPLOYEE.CLEAR_DETACHMENT };
}

export const fetchEmployees = ({ page = 1, limit = 10, search = "" }) => {
  return fetchFromAccount({
    endpoint: `/employee?search=${search}&page=${page}&limit=${limit}`,
    options: { credentials: "same-origin" },
    FETCH_TYPE: EMPLOYEE.FETCH,
    ERROR_TYPE: EMPLOYEE.FETCH_ERROR,
    SUCCES_TYPE: EMPLOYEE.FETCH_SUCCESS,
  });
};

export const fetchEmployee = ({ id }) =>
  fetchFromAccount({
    endpoint: `/employee/${id}`,
    options: { credentials: "same-origin" },
    FETCH_TYPE: EMPLOYEE.FETCH,
    ERROR_TYPE: EMPLOYEE.FETCH_ERROR,
    SUCCES_TYPE: EMPLOYEE.GET,
  });

export const fetchEmployeeByName = ({ name, page = 1, limit = 10 }) =>
  fetchFromAccount({
    endpoint: `/employee/name/?search=${name}&page=${page}&limit=${limit}`,
    options: { credentials: "same-origin" },
    FETCH_TYPE: EMPLOYEE.FETCH,
    ERROR_TYPE: EMPLOYEE.FETCH_ERROR,
    SUCCES_TYPE: EMPLOYEE.GET,
  });

export const fetchNearestDetachment = ({
  page = 1,
  limit = 10,
  employeeId,
}) => {
  return (dispatch) => {
    dispatch({ type: EMPLOYEE.FETCH });
    dispatch(fetchEmployee({ id: employeeId }));
    return fetchApi({
      endpoint: `/employee/nearest-detachment/${employeeId}?page=${page}&limit=${limit}`,
      options: {
        credentials: "same-origin",
      },
    })
      .then((result) => dispatch(getDetachment(employeeId, result)))
      .catch((error) =>
        dispatch({ type: EMPLOYEE.FETCH_ERROR, message: error.message })
      );
  };
};

export const storeEmployee = ({ info, address }) => {
  return (dispatch) => {
    dispatch({ type: EMPLOYEE.FETCH });

    return fetchApi({
      endpoint: `/employee`,
      options: {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ info, address }),
      },
    })
      .then((result) => dispatch(addEmployee(info, address, result)))
      .catch((error) =>
        dispatch({ type: EMPLOYEE.FETCH_ERROR, message: error.message })
      );
  };
};
