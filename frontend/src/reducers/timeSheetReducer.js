import { TIMESHEET_REQUEST, TIMESHEET_SUCCESS, TIMESHEET_FAIL } from "../constants/timeSheetConstants";

export const timesheetReducer = (state = { timesheet: [] }, action) => {
  switch (action.type) {
    case TIMESHEET_REQUEST:
      return { loading: true, timesheet: [] };
    case TIMESHEET_SUCCESS:
      return { loading: false, timesheet: action.payload };
    case TIMESHEET_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
