import * as actions from '../constants/timeSheetConstants';

export const getTimeSheet = (data) => async (dispatch, getState) => {
  try {
    dispatch({
      type: actions.TIMESHEET_REQUEST,
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

export const createDayEntryArray = (id, day, i) => (dispatch) => {
  dispatch({
    type: actions.TIMESHEET_CREATE_DAY_SUCCESS,
    payload: { id: id, day: day },
  });
};

export const deleteDayEntryArray = (data) => (dispatch) => {
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
