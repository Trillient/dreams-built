import * as actions from '../constants/clientConstants';

export const getClientsReducer = (state = { clientList: [] }, action) => {
  switch (action.type) {
    case actions.CLIENT_FETCH_REQUEST:
      return { loading: true };
    case actions.CLIENT_FETCH_SUCCESS:
      return { loading: false, clientList: action.payload };
    case actions.CLIENT_FETCH_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const createClientReducer = (state = { client: {} }, action) => {
  switch (action.type) {
    case actions.CLIENT_CREATE_REQUEST:
      return { loading: true };
    case actions.CLIENT_CREATE_SUCCESS:
      return { loading: false, client: action.payload };
    case actions.CLIENT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
