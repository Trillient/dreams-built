import * as actions from '../constants/contractorConstants';

export const getContractorsReducer = (state = { contractorList: [] }, action) => {
  switch (action.type) {
    case actions.CONTRACTORLIST_FETCH_REQUEST:
      return { loading: true };
    case actions.CONTRACTORLIST_FETCH_SUCCESS:
      return { loading: false, contractorList: action.payload.contractorList, pages: action.payload.pages };
    case actions.CONTRACTORLIST_FETCH_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const contractorReducer = (state = { contractor: [] }, action) => {
  switch (action.type) {
    case actions.CONTRACTOR_RESET_REDIRECT:
      return { redirect: false, contractor: [] };
    case actions.CONTRACTOR_CREATE_REQUEST:
      return { loading: true, redirect: false };
    case actions.CONTRACTOR_CREATE_SUCCESS:
      return { loading: false, redirect: true, contractor: action.payload };
    case actions.CONTRACTOR_CREATE_FAIL:
      return { loading: false, error: action.payload, redirect: false };
    case actions.CONTRACTOR_FETCH_REQUEST:
      return { loading: true };
    case actions.CONTRACTOR_FETCH_SUCCESS:
      return { loading: false, contractorDetails: action.payload };
    case actions.CONTRACTOR_FETCH_FAIL:
      return { loading: false, error: action.payload };
    case actions.CONTRACTOR_UPDATE_REQUEST:
      return { loading: true };
    case actions.CONTRACTOR_UPDATE_SUCCESS:
      return { loading: false, contractor: action.payload };
    case actions.CONTRACTOR_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case actions.CONTRACTOR_DELETE_REQUEST:
      return { loading: true };
    case actions.CONTRACTOR_DELETE_SUCCESS:
      return { loading: false, redirect: true, contractor: action.payload };
    case actions.CONTRACTOR_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
