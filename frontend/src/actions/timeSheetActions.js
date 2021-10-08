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

export const createEntry = (id, day) => (dispatch) => {
  dispatch({
    type: actions.TIMESHEET_CREATE_ENTRY,
    payload: { id: id, day: day },
  });
};

export const deleteEntry = (id) => (dispatch) => {
  dispatch({
    type: actions.TIMESHEET_DELETE_ENTRY,
    payload: id,
  });
};

export const updateEntry = (startTime, endTime, jobNumber, id, day) => (dispatch) => {
  dispatch({
    type: actions.TIMESHEET_UPDATE_ENTRY,
    payload: { id: id, day: day, startTime: startTime, endTime: endTime, jobNumber: jobNumber },
  });
};
