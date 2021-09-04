import { TIMESHEET_REQUEST, TIMESHEET_SUCCESS, TIMESHEET_FAIL } from "../constants/timeSheetConstants";

export const timeSheet = (data) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TIMESHEET_REQUEST,
      payload: data,
    });
    dispatch({
      type: TIMESHEET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TIMESHEET_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
