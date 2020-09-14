import { DETACHMENT } from "../actions/types";
import fetchStates from "./fetchStates";

const DEFAULT_DETACHMENT = {
  detachments: [],
  detachment: {},
  employees: [],
  detachmentId: {},
};

const detachment = (state = DEFAULT_DETACHMENT, action) => {
  switch (action.type) {
    case DETACHMENT.FETCH:
      return { ...state, status: fetchStates.fetching };
    case DETACHMENT.FETCH_ERROR:
      return { ...state, status: fetchStates.error, message: action.message };
    case DETACHMENT.FETCH_SUCCESS:
      return {
        ...state,
        status: fetchStates.success,
        message: action.message,
        detachments: action.data,
        count: action.count,
      };
    case DETACHMENT.ADD: {
      const { result, detachment } = action;
      const addDetachment = { id: result.id, ...detachment };
      return {
        ...state,
        detachments: [addDetachment, ...state.detachments],
        status: fetchStates.success,
        message: result.message,
      };
    }
    case DETACHMENT.GET: {
      return {
        ...state,
        detachment: action.data,
        message: action.message,

        status: fetchStates.success,
      };
    }
    case DETACHMENT.GET_EMPLOYEE: {
      const { result, detachmentId } = action;
      console.log(result);
      return {
        ...state,
        detachmentId,
        employees: result.data,
        count: result.count,
        status: fetchStates.success,
      };
    }
    default:
      return state;
  }
};

export default detachment;
