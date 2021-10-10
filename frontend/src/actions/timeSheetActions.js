import * as actions from '../constants/timeSheetConstants';
import { toast } from 'react-toastify';

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

export const updateEntry = (startTime, endTime, jobNumber, id, day, time) => (dispatch) => {
  dispatch({
    type: actions.TIMESHEET_UPDATE_ENTRY,
    payload: { id: id, day: day, startTime: startTime, endTime: endTime, jobNumber: jobNumber, updated: Date().toLocaleString(), jobTime: time },
  });
};

export const handleSubmit = (data, startDate, endDate) => async (dispatch, getState) => {
  try {
    dispatch({
      type: actions.TIMESHEET_SUBMIT_REQUEST,
    });
    dispatch({
      type: actions.TIMESHEET_SUBMIT_VALIDATE,
    });

    data.map((e) => {
      if (!e.startTime && !e.endTime && !e.jobNumber) {
        return e;
      }
      if (e.jobTime <= 0 || isNaN(e.jobTime)) {
        toast.error(`Check the times entered on ${e.day}!`);
        throw new Error('Incorrect Time Entered!');
      }
      if (!e.jobNumber || e.jobNumber < 21000) {
        toast.error(`Check the Job Numers for ${e.day}!`);
        throw new Error('Job Numer Required!');
      }
      return e;
    });

    const finalisedData = data.filter((e) => e.startTime !== '' && e.endTime !== '' && e.jobNumber !== '');

    const dayArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const sorting = (day) => {
      return finalisedData.filter((e) => e.day === day);
    };

    const end = dayArray.map((e) => {
      if (e === 'Monday') {
        return { Monday: sorting(e) };
      }
      if (e === 'Tuesday') {
        return { Tuesday: sorting(e) };
      }
      if (e === 'Wednesday') {
        return { Wednesday: sorting(e) };
      }
      if (e === 'Thursday') {
        return { Thursday: sorting(e) };
      }
      if (e === 'Friday') {
        return { Friday: sorting(e) };
      }
      if (e === 'Saturday') {
        return { Saturday: sorting(e) };
      }
      if (e === 'Sunday') {
        return { Sunday: sorting(e) };
      }
      toast.error('Something went wrong');
      throw new Error('Something went wrong');
    });

    toast.success('Saved!');
    dispatch({
      type: actions.TIMESHEET_SUBMIT_SUCCESS,
      payload: [{ startDate: startDate }, { endDate: endDate }, { entries: end }],
    });
  } catch (error) {
    dispatch({
      type: actions.TIMESHEET_SUBMIT_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
