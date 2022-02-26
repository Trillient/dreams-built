import axios from 'axios';
import { DateTime } from 'luxon';
import { toast } from 'react-toastify';
import * as actions from '../constants/reportConstants';

export const sorter = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

export const getEmployeeTimeSheets = (token, weekStart) => async (dispatch) => {
  try {
    dispatch({
      type: actions.REPORT_EMPLOYEES_TIMESHEET_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/timesheet/admin?weekstart=${weekStart}`, config);

    const sortedByJob = Array.from(
      data.entries.sort((a, b) => a.jobNumber - b.jobNumber).reduce((m, { jobNumber, ...o }) => m.set(jobNumber, [...(m.get(jobNumber) || []), o]), new Map()),
      ([jobNumber, value]) => ({ jobNumber, value })
    );

    const sortedByUser = Array.from(
      data.entries
        .sort((a, b) => (a.user.firstName && b.user.firstName ? a.user.firstName.normalize().localeCompare(b.user.firstName.normalize()) : false))
        .sort((a, b) => {
          const firstTime = a.startTime.split(':');
          const secondTime = b.startTime.split(':');
          return +firstTime[0] * 60 + +firstTime[1] - (+secondTime[0] * 60 + +secondTime[1]);
        })
        .sort((a, b) => sorter[a.day] - sorter[b.day])
        .reduce((m, { userId, ...o }) => m.set(userId, [...(m.get(userId) || []), o]), new Map()),
      ([userId, value]) => ({ userId, value })
    );

    dispatch({
      type: actions.REPORT_EMPLOYEES_TIMESHEET_SUCCESS,
      payload: { sortedByJob: sortedByJob, sortedByEmployee: sortedByUser, comments: data.comments },
    });
  } catch (error) {
    dispatch({
      type: actions.REPORT_EMPLOYEES_TIMESHEET_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const getEmployeeTimeSheetsNotEntered = (token, weekStart) => async (dispatch) => {
  try {
    dispatch({
      type: actions.REPORT_EMPLOYEES_NOT_ENTERED_TIMESHEET_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/timesheet/admin/users?weekstart=${weekStart}`, config);

    dispatch({
      type: actions.REPORT_EMPLOYEES_NOT_ENTERED_TIMESHEET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: actions.REPORT_EMPLOYEES_NOT_ENTERED_TIMESHEET_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const updateEmployeeTimesheetEntry = (token, entryId, startTime, endTime, jobId) => async (dispatch) => {
  try {
    dispatch({
      type: actions.REPORT_UPDATE_EMPLOYEE_TIMESHEET_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    let errors = [];
    let jobTime;

    if (!endTime) {
      errors = [...errors, { message: `End Time Not Entered` }];
    }

    if (!startTime) {
      errors = [...errors, { message: `Start Time Not Entered` }];
    }

    if (startTime && endTime) {
      jobTime = (DateTime.fromFormat(endTime, 'hh:mm').diff(DateTime.fromFormat(startTime, 'hh:mm'), 'seconds', 'minutes').toFormat('mm') / 60).toFixed(2);
    }

    if (jobTime <= 0 || isNaN(jobTime)) {
      errors = [...errors, { message: `Times Not Valid` }];
    }

    if (errors.length > 0) {
      const duplicateReduction = [...new Set(errors.map((err) => err.message))];
      duplicateReduction.map((err) => toast.error(err));
      dispatch({
        type: actions.REPORT_ENTRY_VALIDATION_FAIL,
      });
      throw new Error('Validation Errors');
    }

    const entry = {
      startTime: startTime,
      endTime: endTime,
      job: jobId,
      jobTime: jobTime,
    };

    const { data } = await axios.patch(`${process.env.REACT_APP_API_URL}/timesheet/admin/users/entry/${entryId}`, entry, config);

    toast.success('Saved!');

    dispatch({
      type: actions.REPORT_UPDATE_EMPLOYEE_TIMESHEET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.response.data.errors ? error.response.data.errors : error.message;

    if (error.response.data.errors && message.length > 0) {
      message.map((err) => toast.error(err.msg));
    } else {
      toast.error(message);
    }
    dispatch({
      type: actions.REPORT_UPDATE_EMPLOYEE_TIMESHEET_FAIL,
    });
  }
};

export const deleteEmployeeTimesheetEntry = (token, entryId) => async (dispatch) => {
  try {
    dispatch({
      type: actions.REPORT_DELETE_EMPLOYEE_TIMESHEET_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/timesheet/admin/users/entry/${entryId}`, config);

    toast.success('Deleted!');

    dispatch({
      type: actions.REPORT_DELETE_EMPLOYEE_TIMESHEET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.response.data.errors ? error.response.data.errors : error.message;

    if (error.response.data.errors && message.length > 0) {
      message.map((err) => toast.error(err.msg));
    } else {
      toast.error(message);
    }
    dispatch({
      type: actions.REPORT_DELETE_EMPLOYEE_TIMESHEET_FAIL,
    });
  }
};

export const resetReportRefresh = () => async (dispatch) => {
  dispatch({
    type: actions.REPORT_RESET,
  });
};
