import axios from 'axios';
import { toast } from 'react-toastify';

import * as actions from '../constants/contractorConstants';

export const getContractors =
  (token, limit = '', page = '', search = '') =>
  async (dispatch) => {
    try {
      dispatch({
        type: actions.CONTRACTORLIST_FETCH_REQUEST,
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/contractors?limit=${limit}&page=${page}&keyword=${search}`, config);

      dispatch({
        type: actions.CONTRACTORLIST_FETCH_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;

      dispatch({
        type: actions.CONTRACTORLIST_FETCH_FAIL,
        payload: message,
      });
    }
  };

export const getContractor = (token, contractorId) => async (dispatch) => {
  try {
    dispatch({
      type: actions.CONTRACTOR_FETCH_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/contractors/${contractorId}`, config);

    dispatch({
      type: actions.CONTRACTOR_FETCH_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;

    dispatch({
      type: actions.CONTRACTOR_FETCH_FAIL,
      payload: message,
    });
  }
};

export const createContractor =
  ({ token, contractor }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: actions.CONTRACTOR_CREATE_REQUEST,
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/contractors`, contractor, config);

      toast.success('Saved!');

      dispatch({
        type: actions.CONTRACTOR_CREATE_SUCCESS,
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
        type: actions.CONTRACTOR_CREATE_FAIL,
        payload: message,
      });
    }
  };

export const updateContractor =
  ({ token, contractor, contractorId }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: actions.CONTRACTOR_UPDATE_REQUEST,
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/contractors/${contractorId}`, contractor, config);
      toast.success('Saved!');
      dispatch({
        type: actions.CONTRACTOR_UPDATE_SUCCESS,
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
        type: actions.CONTRACTOR_UPDATE_FAIL,
        payload: message,
      });
    }
  };

export const deleteContractor = (token, contractorId) => async (dispatch) => {
  try {
    dispatch({
      type: actions.CONTRACTOR_DELETE_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/contractors/${contractorId}`, config);

    toast.success('Deleted!');

    dispatch({
      type: actions.CONTRACTOR_DELETE_SUCCESS,
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
      type: actions.CONTRACTOR_DELETE_FAIL,
      payload: message,
    });
  }
};

export const resetContractorRedirect = () => async (dispatch) => {
  dispatch({
    type: actions.CONTRACTOR_RESET_REDIRECT,
  });
};
