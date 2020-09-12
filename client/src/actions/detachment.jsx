import { DETACHMENT } from "./types";
import { fetchFromAccount } from "./account";
import fetchApi from "../util/fetchApi";

function addDetachment(detachment, result) {
  return {
    type: DETACHMENT.ADD,
    detachment,
    result,
  };
}

export const fetchDetachments = ({ page = 1, limit = 10, search = "" }) => {
  return fetchFromAccount({
    endpoint: `/detachment?search=${search}&page=${page}&limit=${limit}`,
    options: { credentials: "same-origin" },
    FETCH_TYPE: DETACHMENT.FETCH,
    ERROR_TYPE: DETACHMENT.FETCH_ERROR,
    SUCCES_TYPE: DETACHMENT.FETCH_SUCCESS,
  });
};

export const fetchDetachment = ({ id }) =>
  fetchFromAccount({
    endpoint: `/detachment/${id}`,
    options: { credentials: "same-origin" },
    FETCH_TYPE: DETACHMENT.FETCH,
    ERROR_TYPE: DETACHMENT.FETCH_ERROR,
    SUCCES_TYPE: DETACHMENT.GET,
  });

export const storeDetachment = (detachment) => {
  return (dispatch) => {
    dispatch({ type: DETACHMENT.FETCH });

    return fetchApi({
      endpoint: "/detachment",
      options: {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(detachment),
      },
    })
      .then((result) => dispatch(addDetachment(detachment, result)))
      .catch((error) =>
        dispatch({ type: DETACHMENT.FETCH_ERROR, message: error.message })
      );
  };
};
