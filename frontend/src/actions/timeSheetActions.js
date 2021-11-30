import * as actions from '../constants/timeSheetConstants';
import { toast } from 'react-toastify';
import axios from 'axios';

export const getTimeSheet = (token, id, weekStart) => async (dispatch) => {
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
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/timesheet/user/${id}?weekstart=${weekStart}`, config);

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

export const handleSubmit = (data, startDate, endDate, token, id) => async (dispatch, getState) => {
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

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.post(`${process.env.REACT_APP_API_URL}/timesheet/user/${id}`, { weekStart: startDate, weekEnd: endDate, entries: finalisedData }, config).catch(function (error) {
      dispatch({
        type: actions.TIMESHEET_SUBMIT_FAIL,
        payload: error.response && error.response.data.message ? error.response.data.message : error.message,
      });
    });

    toast.success('Saved!');
    dispatch({
      type: actions.TIMESHEET_SUBMIT_SUCCESS,
      payload: [{ startDate: startDate }, { endDate: endDate }, { entries: finalisedData }],
    });
  } catch (error) {
    dispatch({
      type: actions.TIMESHEET_SUBMIT_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
