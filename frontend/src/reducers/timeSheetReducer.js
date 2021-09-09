import * as actions from "../constants/timeSheetConstants";

export const timeSheetReducer = (state = { timesheet: [] }, action) => {
  switch (action.type) {
    case actions.TIMESHEET_REQUEST:
      return { loading: true, timesheet: [] };
    case actions.TIMESHEET_SUCCESS:
      return { loading: false, timesheet: action.payload };
    case actions.TIMESHEET_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
