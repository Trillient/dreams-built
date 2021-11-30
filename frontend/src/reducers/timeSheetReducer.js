import * as actions from '../constants/timeSheetConstants';

export const getTimeSheetReducer = (state = { timesheets: [] }, action) => {
  switch (action.type) {
    case actions.TIMESHEET_REQUEST:
      return { loading: true };
    case actions.TIMESHEET_SUCCESS:
      return { loading: false };
    case actions.TIMESHEET_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const entryArrayReducer = (state = { dayEntries: [] }, action) => {
  switch (action.type) {
    case actions.TIMESHEET_POPULATE:
      return { ...state, dayEntries: action.payload };
    case actions.TIMESHEET_CREATE_ENTRY:
      return { ...state, dayEntries: [...state.dayEntries, action.payload] };
    case actions.TIMESHEET_DELETE_ENTRY:
      return { ...state, dayEntries: state.dayEntries.filter((x) => x.id !== action.payload) };
    case actions.TIMESHEET_UPDATE_ENTRY:
      return { ...state, dayEntries: state.dayEntries.map((x) => (x.id === action.payload.id ? action.payload : x)) };
    default:
      return state;
  }
};

export const validateReducer = (state = { validatedEntries: [], loading: true, error: false }, action) => {
  switch (action.type) {
    case actions.TIMESHEET_SUBMIT_REQUEST:
      return { loading: true, error: false };
    case actions.TIMESHEET_SUBMIT_VALIDATE:
      return { loading: true, error: false };
    case actions.TIMESHEET_SUBMIT_SUCCESS:
      return { loading: false, validatedEntries: action.payload, error: false };
    case actions.TIMESHEET_SUBMIT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
