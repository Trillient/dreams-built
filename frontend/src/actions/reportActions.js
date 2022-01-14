import axios from 'axios';
import * as actions from '../constants/reportConstants';

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

    const sorter = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 7,
    };

    const sortedByJob = Array.from(
      data.sort((a, b) => a.jobNumber - b.jobNumber).reduce((m, { jobNumber, ...o }) => m.set(jobNumber, [...(m.get(jobNumber) || []), o]), new Map()),
      ([jobNumber, value]) => ({ jobNumber, value })
    );

    const sortedByUser = Array.from(
      data
        .sort((a, b) => a.user.firstName.normalize().localeCompare(b.user.firstName.normalize()))
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
      payload: { sortedByJob: sortedByJob, sortedByEmployee: sortedByUser },
    });
  } catch (error) {
    dispatch({
      type: actions.REPORT_EMPLOYEES_TIMESHEET_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
