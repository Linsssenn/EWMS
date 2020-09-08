import { DETACHMENT } from "./types";
import { fetchFromAccount } from "./account";

export const fetchDetachments = ({ page = 1, limit = 10 }) => {
  return fetchFromAccount({
    endpoint: `/detachment?page=${page}&limit=${limit}`,
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
