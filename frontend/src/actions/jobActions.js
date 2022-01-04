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

export const getJob = (token, jobId) => async (dispatch) => {
  try {
    dispatch({
      type: actions.JOB_FETCH_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/job/details/${jobId}`, config);

    dispatch({
      type: actions.JOB_FETCH_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;

    dispatch({
      type: actions.JOB_FETCH_FAIL,
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

export const updateJob =
  ({ job, token, jobId }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: actions.JOB_UPDATE_REQUEST,
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/job/details/${jobId}`, job, config);

      toast.success('Saved!');
      dispatch({
        type: actions.JOB_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;

      dispatch({
        type: actions.JOB_UPDATE_FAIL,
        payload: message,
      });
    }
  };

export const deleteJob = (token, jobId) => async (dispatch) => {
  try {
    dispatch({
      type: actions.JOB_DELETE_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/job/details/${jobId}`, config);
    toast.success('Deleted!');
    dispatch({
      type: actions.JOB_DELETE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    toast.error(message);
    dispatch({
      type: actions.JOB_DELETE_FAIL,
      payload: message,
    });
  }
};

export const resetJobRedirect = () => async (dispatch) => {
  dispatch({
    type: actions.JOB_RESET_REDIRECT,
  });
};

export const getJobPartsList = (token) => async (dispatch) => {
  try {
    dispatch({
      type: actions.JOBPARTLIST_FETCH_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/job/parts`, config);

    const sortedData = data.sort((a, b) => a.jobOrder - b.jobOrder);

    dispatch({
      type: actions.JOBPARTLIST_FETCH_SUCCESS,
      payload: sortedData,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;

    dispatch({
      type: actions.JOBPARTLIST_FETCH_FAIL,
      payload: message,
    });
  }
};

export const createJobPart =
  ({ token, jobPart }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: actions.JOBPART_CREATE_REQUEST,
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/job/parts`, jobPart, config);

      toast.success('Saved!');
      dispatch({
        type: actions.JOBPART_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;

      dispatch({
        type: actions.JOBPART_CREATE_FAIL,
        payload: message,
      });
    }
  };

export const resetJobPartRedirect = () => async (dispatch) => {
  dispatch({
    type: actions.JOB_RESET_REDIRECT,
  });
};
