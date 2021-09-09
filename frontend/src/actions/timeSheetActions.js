import axios from "axios";
import * as actions from "../constants/timeSheetConstants";

export const timeSheet = (data) => async (dispatch, getState) => {
  try {
    dispatch({
      type: actions.TIMESHEET_REQUEST,
      payload: data,
    });
    dispatch({
      type: actions.TIMESHEET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: actions.TIMESHEET_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
