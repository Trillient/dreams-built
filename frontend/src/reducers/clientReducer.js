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
