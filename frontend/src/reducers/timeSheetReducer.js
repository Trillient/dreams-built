import * as actions from '../constants/timesheetConstants';

export const entryArrayReducer = (state = { dayEntries: [], comments: [], loading: false, error: false }, action) => {
  switch (action.type) {
    case actions.TIMESHEET_REQUEST:
      return { ...state, loading: true };
    case actions.TIMESHEET_CREATE_ENTRY:
      return { ...state, dayEntries: [...state.dayEntries, action.payload] };
    case actions.TIMESHEET_DELETE_ENTRY:
      return { ...state, dayEntries: state.dayEntries.filter((entry) => entry.entryId !== action.payload) };
    case actions.TIMESHEET_UPDATE_ENTRY:
      return { ...state, dayEntries: state.dayEntries.map((entry) => (entry.entryId === action.payload.entryId ? action.payload : entry)) };
    case actions.TIMESHEET_UPDATE_COMMENTS:
      return { ...state, comments: [...state.comments.filter((comment) => comment.day !== action.payload.day), action.payload] };
    case actions.TIMESHEET_SUCCESS:
      return { ...state, loading: false, dayEntries: action.payload.entries, comments: action.payload.comments };
    case actions.TIMESHEET_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const validateReducer = (state = { validatedEntries: [], loading: true, error: false, success: null }, action) => {
  switch (action.type) {
    case actions.TIMESHEET_SUBMIT_REQUEST:
      return { loading: true, clientValidationErrors: [] };
    case actions.TIMESHEET_SUBMIT_VALIDATED:
      return { loading: true };
    case actions.TIMESHEET_VALIDATION_FAIL:
      return { loading: true, clientValidationErrors: action.payload };
    case actions.TIMESHEET_SUBMIT_SUCCESS:
      return { ...state, loading: false, success: true, error: false };
    case actions.TIMESHEET_SUBMIT_FAIL:
      return { ...state, loading: false, error: action.payload.error };
    default:
      return state;
  }
};
