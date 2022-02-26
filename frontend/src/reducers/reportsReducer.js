import * as actions from '../constants/reportConstants';

export const reportReducer = (state = { timesheets: [], error: false, usersNotEntered: [], refresh: false }, action) => {
  switch (action.type) {
    case actions.REPORT_EMPLOYEES_TIMESHEET_REQUEST:
      return { ...state, loading: true, error: false };
    case actions.REPORT_EMPLOYEES_TIMESHEET_SUCCESS:
      return { ...state, loading: false, error: false, timesheets: action.payload };
    case actions.REPORT_EMPLOYEES_TIMESHEET_FAIL:
      return { ...state, loading: false, error: action.payload };
    case actions.REPORT_UPDATE_EMPLOYEE_TIMESHEET_REQUEST:
      return { ...state, loading: true, error: false };
    case actions.REPORT_UPDATE_EMPLOYEE_TIMESHEET_SUCCESS:
      return { ...state, loading: false, error: false, refresh: true };
    case actions.REPORT_UPDATE_EMPLOYEE_TIMESHEET_FAIL:
      return { ...state, loading: false };
    case actions.REPORT_DELETE_EMPLOYEE_TIMESHEET_REQUEST:
      return { ...state, loading: true, error: false };
    case actions.REPORT_DELETE_EMPLOYEE_TIMESHEET_SUCCESS:
      return { ...state, loading: false, error: false, refresh: true };
    case actions.REPORT_DELETE_EMPLOYEE_TIMESHEET_FAIL:
      return { ...state, loading: false };
    case actions.REPORT_ENTRY_VALIDATION_FAIL:
      return { ...state, loading: false };
    case actions.REPORT_EMPLOYEES_NOT_ENTERED_TIMESHEET_REQUEST:
      return { ...state, loading: true, error: false };
    case actions.REPORT_EMPLOYEES_NOT_ENTERED_TIMESHEET_SUCCESS:
      return { ...state, loading: false, error: false, usersNotEntered: action.payload };
    case actions.REPORT_EMPLOYEES_NOT_ENTERED_TIMESHEET_FAIL:
      return { ...state, loading: false, error: action.payload };
    case actions.REPORT_RESET:
      return { ...state, refresh: false };
    default:
      return state;
  }
};
