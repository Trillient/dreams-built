import * as actions from '../constants/timeSheetConstants';

export const getTimeSheetReducer = (state = { timesheets: [] }, action) => {
  switch (action.type) {
    case actions.TIMESHEET_REQUEST:
      return { loading: true, timesheets: [] };
    case actions.TIMESHEET_SUCCESS:
      return { loading: false, timesheets: action.payload };
    case actions.TIMESHEET_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const createDayEntryArrayReducer = (state = { dayEntries: [] }, action) => {
  switch (action.type) {
    case actions.TIMESHEET_CREATE_DAY_SUCCESS:
      return { ...state, dayEntries: [...state.dayEntries, action.payload] };
    default:
      return state;
  }
};
