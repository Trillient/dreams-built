import * as actions from '../constants/reportConstants';

export const reportReducer = (state = { timesheets: [], error: false }, action) => {
  switch (action.type) {
    case actions.REPORT_EMPLOYEES_TIMESHEET_REQUEST:
      return { ...state, loading: true, error: false };
    case actions.REPORT_EMPLOYEES_TIMESHEET_SUCCESS:
      return { ...state, loading: false, error: false, timesheets: action.payload };
    case actions.REPORT_EMPLOYEES_TIMESHEET_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};