import * as actions from '../constants/employeeConstants';

export const getEmployeesReducer = (state = { employeeList: [] }, action) => {
  switch (action.type) {
    case actions.EMPLOYEELIST_FETCH_REQUEST:
      return { loading: true };
    case actions.EMPLOYEELIST_FETCH_SUCCESS:
      return { loading: false, employeeList: action.payload };
    case actions.EMPLOYEELIST_FETCH_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
