import axios from 'axios';
import { toast } from 'react-toastify';

import * as actions from '../constants/jobConstants';

export const getJobList = (token) => async (dispatch) => {
  try {
    dispatch({
      type: actions.JOBLIST_FETCH_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/job/details`, config);

    const sortedData = data.sort((a, b) => b.jobNumber - a.jobNumber);

    dispatch({
      type: actions.JOBLIST_FETCH_SUCCESS,
      payload: sortedData,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;

    dispatch({
      type: actions.JOBLIST_FETCH_FAIL,
      payload: message,
    });
  }
};

export const createJob =
  ({ job, token }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: actions.JOB_CREATE_REQUEST,
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/job/details`, job, config);

      toast.success('Saved!');
      dispatch({
        type: actions.JOB_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;

      dispatch({
        type: actions.JOB_CREATE_FAIL,
        payload: message,
      });
    }
  };

export const getClients = (token) => async (dispatch) => {
  try {
    dispatch({
      type: actions.CLIENT_FETCH_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/clients`, config);

    dispatch({
      type: actions.CLIENT_FETCH_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;

    dispatch({
      type: actions.CLIENT_FETCH_FAIL,
      payload: message,
    });
  }
};
