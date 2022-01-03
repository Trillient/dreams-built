import * as actions from '../constants/clientConstants';

export const getClientsReducer = (state = { clientList: [] }, action) => {
  switch (action.type) {
    case actions.CLIENTLIST_FETCH_REQUEST:
      return { loading: true };
    case actions.CLIENTLIST_FETCH_SUCCESS:
      return { loading: false, clientList: action.payload };
    case actions.CLIENTLIST_FETCH_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const clientReducer = (state = { client: [] }, action) => {
  switch (action.type) {
    case actions.RESET_REDIRECT:
      return { redirect: false, client: [] };
    case actions.CLIENT_CREATE_REQUEST:
      return { loading: true, redirect: false };
    case actions.CLIENT_CREATE_SUCCESS:
      return { loading: false, redirect: true, client: action.payload };
    case actions.CLIENT_CREATE_FAIL:
      return { loading: false, error: action.payload, redirect: false };
    case actions.CLIENT_FETCH_REQUEST:
      return { loading: true };
    case actions.CLIENT_FETCH_SUCCESS:
      return { loading: false, clientDetails: action.payload };
    case actions.CLIENT_FETCH_FAIL:
      return { loading: false, error: action.payload };
    case actions.CLIENT_UPDATE_REQUEST:
      return { loading: true };
    case actions.CLIENT_UPDATE_SUCCESS:
      return { loading: false, client: action.payload };
    case actions.CLIENT_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case actions.CLIENT_DELETE_REQUEST:
      return { loading: true };
    case actions.CLIENT_DELETE_SUCCESS:
      return { loading: false, client: action.payload };
    case actions.CLIENT_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
