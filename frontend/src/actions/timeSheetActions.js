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
      payload: { entries: data.entries, comments: data.comments },
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
    payload: { entryId: entryId, day: day, startTime: startTime, endTime: endTime, job: job, jobTime: time },
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
    let errors = [];
    data.map((e) => {
      if (!e.startTime && !e.endTime && !e.job) {
        return e;
      }

      if (!e.startTime && e.endTime) {
        errors = [...errors, { message: `${e.day} Times Not Valid`, entryId: e.entryId, error: 'startTime' }];
      }

      if (!e.endTime && e.startTime) {
        errors = [...errors, { message: `${e.day} Times Not Valid`, entryId: e.entryId, error: 'endTime' }];
      }

      if (e.jobTime <= 0 || isNaN(e.jobTime)) {
        errors = [...errors, { message: `${e.day} Times Not Valid`, entryId: e.entryId, error: 'time' }];
      }

      if (!e.job) {
        errors = [...errors, { message: `${e.day} Job Numbers Not Entered`, entryId: e.entryId, error: 'job' }];
      }

      return e;
    });

    if (errors.length > 0) {
      const duplicateReduction = [...new Set(errors.map((err) => err.message))];
      duplicateReduction.map((err) => toast.error(err));
      dispatch({
        type: actions.TIMESHEET_VALIDATION_FAIL,
        payload: errors,
      });
      throw new Error('Validation Errors');
    }

    const finalisedData = data.filter((e) => e.startTime !== '' && e.endTime !== '' && e.job !== '');
    const finalisedComments = comments.filter((comment) => comment.comments !== '');

    dispatch({
      type: actions.TIMESHEET_SUBMIT_VALIDATED,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.post(`${process.env.REACT_APP_API_URL}/timesheet/user/${userId}`, { weekStart: startDate, weekEnd: endDate, entries: finalisedData, comments: finalisedComments }, config).catch((error) => {
      dispatch({
        type: actions.TIMESHEET_SUBMIT_FAIL,
        payload: error.response && error.response.data.message ? error.response.data.message : error.message,
      });
    });
    toast.success('Saved!');
    dispatch({
      type: actions.TIMESHEET_SUBMIT_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: actions.TIMESHEET_SUBMIT_FAIL,
      payload: { error: error.response && error.response.data.message ? error.response.data.message : error.message },
    });
  }
};
