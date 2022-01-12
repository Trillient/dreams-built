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
    type: actions.JOBPART_RESET_REDIRECT,
  });
};

export const getJobPart = (token, jobPartId) => async (dispatch) => {
  try {
    dispatch({
      type: actions.JOBPART_FETCH_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/job/parts/${jobPartId}`, config);

    dispatch({
      type: actions.JOBPART_FETCH_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;

    dispatch({
      type: actions.JOBPART_FETCH_FAIL,
      payload: message,
    });
  }
};

export const updateJobPart =
  ({ jobPart, token, jobPartId }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: actions.JOBPART_UPDATE_REQUEST,
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/job/parts/${jobPartId}`, jobPart, config);

      toast.success('Saved!');
      dispatch({
        type: actions.JOBPART_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;

      dispatch({
        type: actions.JOBPART_UPDATE_FAIL,
        payload: message,
      });
    }
  };

export const deleteJobPart = (token, jobPartId) => async (dispatch) => {
  try {
    dispatch({
      type: actions.JOBPART_DELETE_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/job/parts/${jobPartId}`, config);
    toast.success('Deleted!');
    dispatch({
      type: actions.JOBPART_DELETE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    toast.error(message);
    dispatch({
      type: actions.JOBPART_DELETE_FAIL,
      payload: message,
    });
  }
};

export const getJobDueDates = (token, jobId) => async (dispatch) => {
  try {
    dispatch({
      type: actions.JOBPART_DUEDATELIST_FETCH_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/job/duedates/parts/${jobId}`, config);

    dispatch({
      type: actions.JOBPART_DUEDATELIST_FETCH_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    toast.error(message);
    dispatch({
      type: actions.JOBPART_DUEDATELIST_FETCH_FAIL,
      payload: message,
    });
  }
};

export const createJobPartDueDate = (token, jobId, jobPart, dueDate) => async (dispatch) => {
  try {
    dispatch({
      type: actions.JOBPART_DUEDATE_CREATE_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/job/duedates/parts/${jobId}?partid=${jobPart}`, { dueDate: dueDate }, config);

    toast.success('Created!');
    dispatch({
      type: actions.JOBPART_DUEDATE_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    toast.error(message);
    dispatch({
      type: actions.JOBPART_DUEDATE_CREATE_FAIL,
      payload: message,
    });
  }
};

export const updateJobPartDueDate = (token, dueId, dueDate) => async (dispatch) => {
  try {
    dispatch({
      type: actions.JOBPART_DUEDATE_UPDATE_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/job/duedates/job/part/${dueId}`, { dueDate: dueDate }, config);

    toast.success('Saved!');
    dispatch({
      type: actions.JOBPART_DUEDATE_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    toast.error(message);
    dispatch({
      type: actions.JOBPART_DUEDATE_UPDATE_FAIL,
      payload: message,
    });
  }
};

export const deleteJobPartDueDate = (token, dueId) => async (dispatch) => {
  try {
    dispatch({
      type: actions.JOBPART_DUEDATE_UPDATE_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/job/duedates/job/part/${dueId}`, config);

    toast.success('Deleted!');
    dispatch({
      type: actions.JOBPART_DUEDATE_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    toast.error(message);
    dispatch({
      type: actions.JOBPART_DUEDATE_UPDATE_FAIL,
      payload: message,
    });
  }
};

export const getDueDates = (token, weekStart, weekEnd) => async (dispatch) => {
  try {
    dispatch({
      type: actions.DUEDATELIST_FETCH_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/job/duedates/parts?rangeStart=${weekStart}&rangeEnd=${weekEnd}`, config);
    dispatch({
      type: actions.DUEDATELIST_FETCH_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    toast.error(message);
    dispatch({
      type: actions.DUEDATELIST_FETCH_FAIL,
      payload: message,
    });
  }
};
