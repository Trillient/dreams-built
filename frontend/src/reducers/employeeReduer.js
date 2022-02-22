import * as actions from '../constants/employeeConstants';

export const getEmployeesReducer = (state = { employeeList: [] }, action) => {
  switch (action.type) {
    case actions.EMPLOYEELIST_FETCH_REQUEST:
      return { loading: true };
    case actions.EMPLOYEELIST_FETCH_SUCCESS:
      return { loading: false, employeeList: action.payload.users, pages: action.payload.pages };
    case actions.EMPLOYEELIST_FETCH_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userReducer = (state = { user: [] }, action) => {
  switch (action.type) {
    case actions.USER_RESET_REDIRECT:
      return { redirect: false, user: [] };
    case actions.USER_CREATE_REQUEST:
      return { loading: true, redirect: false };
    case actions.USER_CREATE_SUCCESS:
      return { loading: false, redirect: true, user: action.payload };
    case actions.USER_CREATE_FAIL:
      return { loading: false, error: action.payload, redirect: false };
    case actions.USER_FETCH_REQUEST:
      return { loading: true };
    case actions.USER_FETCH_SUCCESS:
      return { loading: false, user: action.payload.user, roles: action.payload.roles };
    case actions.USER_FETCH_FAIL:
      return { loading: false, error: action.payload };
    case actions.USER_UPDATE_REQUEST:
      return { loading: true };
    case actions.USER_UPDATE_SUCCESS:
      return { loading: false, redirect: true, user: action.payload };
    case actions.USER_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case actions.USER_DELETE_REQUEST:
      return { loading: true };
    case actions.USER_DELETE_SUCCESS:
      return { loading: false, redirect: true, user: action.payload };
    case actions.USER_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case actions.USER_DELETE_ROLE_REQUEST:
      return { ...state, loading: true };
    case actions.USER_DELETE_ROLE_SUCCESS:
      return { ...state, loading: false, roles: action.payload.roles };
    case actions.USER_DELETE_ROLE_FAIL:
      return { loading: false, error: action.payload };
    case actions.USER_ADD_ROLE_REQUEST:
      return { ...state, loading: true };
    case actions.USER_ADD_ROLE_SUCCESS:
      return { ...state, loading: false, roles: action.payload.roles };
    case actions.USER_ADD_ROLE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const profileReducer = (state = { userData: '', error: false }, action) => {
  switch (action.type) {
    case actions.PROFILE_FETCH_REQUEST:
      return { ...state, loading: true };
    case actions.PROFILE_FETCH_SUCCESS:
      return { ...state, loading: false, userData: action.payload };
    case actions.PROFILE_FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    case actions.PROFILE_UPDATE_REQUEST:
      return { ...state, loading: true };
    case actions.PROFILE_UPDATE_SUCCESS:
      return { ...state, loading: false, userData: action.payload.userProfile };
    case actions.PROFILE_UPDATE_FAIL:
      return { ...state, loading: false };
    default:
      return state;
  }
};
