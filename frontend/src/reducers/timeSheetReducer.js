import * as actions from '../constants/timesheetConstants';

export const entryArrayReducer = (state = { dayEntries: [], error: false }, action) => {
  switch (action.type) {
    case actions.TIMESHEET_REQUEST:
      return { ...state, loading: true };
    case actions.TIMESHEET_POPULATE:
      return { ...state, dayEntries: action.payload };
    case actions.TIMESHEET_CREATE_ENTRY:
      return { ...state, dayEntries: [...state.dayEntries, action.payload] };
    case actions.TIMESHEET_DELETE_ENTRY:
      return { ...state, dayEntries: state.dayEntries.filter((entry) => entry.entryId !== action.payload) };
    case actions.TIMESHEET_UPDATE_ENTRY:
      return { ...state, dayEntries: state.dayEntries.map((entry) => (entry.entryId === action.payload.entryId ? action.payload : entry)) };
    case actions.TIMESHEET_SUCCESS:
      return { ...state, loading: false };
    case actions.TIMESHEET_FAIL:
      return { loading: false, error: action.payload };
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
