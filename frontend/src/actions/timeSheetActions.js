import * as actions from '../constants/timesheetConstants';
import { toast } from 'react-toastify';
import axios from 'axios';

export const getTimesheet = (token, userId, weekStart) => async (dispatch) => {
  try {
    dispatch({
      type: actions.TIMESHEET_REQUEST,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/timesheet/user/${userId}?weekstart=${weekStart}`, config);

    dispatch({
      type: actions.TIMESHEET_SUCCESS,
      payload: data.entries,
    });

    dispatch({
      type: actions.TIMESHEET_POPULATE,
      payload: data.entries,
    });
  } catch (error) {
    dispatch({
      type: actions.TIMESHEET_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const createEntry = (entryId, day) => (dispatch) => {
  dispatch({
    type: actions.TIMESHEET_CREATE_ENTRY,
    payload: { entryId: entryId, day: day },
  });
};

export const deleteEntry = (entryId) => (dispatch) => {
  dispatch({
    type: actions.TIMESHEET_DELETE_ENTRY,
    payload: entryId,
  });
};

export const updateEntry = (startTime, endTime, job, entryId, day, time) => (dispatch) => {
  dispatch({
    type: actions.TIMESHEET_UPDATE_ENTRY,
    payload: { entryId: entryId, day: day, startTime: startTime, endTime: endTime, job: job, updated: Date().toLocaleString(), jobTime: time },
  });
};

export const updateComments = (day, comments) => (dispatch) => {
  dispatch({
    type: actions.TIMESHEET_UPDATE_COMMENTS,
    payload: { day: day, comments: comments },
  });
};

export const handleSubmit = (data, startDate, endDate, token, userId, comments) => async (dispatch) => {
  try {
    dispatch({
      type: actions.TIMESHEET_SUBMIT_REQUEST,
    });

    dispatch({
      type: actions.TIMESHEET_SUBMIT_VALIDATE,
    });

    data.map((e) => {
      if (!e.startTime && !e.endTime && !e.job) {
        return e;
      }
      if (e.jobTime <= 0 || isNaN(e.jobTime)) {
        toast.error(`Check the times entered on ${e.day}!`);
        throw new Error('Incorrect Time Entered!');
      }
      if (!e.job) {
        toast.error(`Check the Job Numbers for ${e.day}!`);
        throw new Error('Job Number Required!');
      }
      return e;
    });

    const finalisedData = data.filter((e) => e.startTime !== '' && e.endTime !== '' && e.job !== '');
    const finalisedComments = comments.filter((comment) => comment.comments !== '');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.post(`${process.env.REACT_APP_API_URL}/timesheet/user/${userId}`, { weekStart: startDate, weekEnd: endDate, entries: finalisedData, comments: finalisedComments }, config).catch(function (error) {
      dispatch({
        type: actions.TIMESHEET_SUBMIT_FAIL,
        payload: error.response && error.response.data.message ? error.response.data.message : error.message,
      });
    });

    toast.success('Saved!');
    dispatch({
      type: actions.TIMESHEET_SUBMIT_SUCCESS,
      payload: { startDate: startDate, endDate: endDate, entries: finalisedData },
    });
  } catch (error) {
    dispatch({
      type: actions.TIMESHEET_SUBMIT_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
