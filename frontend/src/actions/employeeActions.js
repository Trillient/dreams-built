import axios from 'axios';
import { toast } from 'react-toastify';

import * as actions from '../constants/employeeConstants';

export const getEmployees = (token) => async (dispatch) => {
  try {
    dispatch({
      type: actions.EMPLOYEELIST_FETCH_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users`, config);

    dispatch({
      type: actions.EMPLOYEELIST_FETCH_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;

    dispatch({
      type: actions.EMPLOYEELIST_FETCH_FAIL,
      payload: message,
    });
  }
};

export const getUser = (token, userId) => async (dispatch) => {
  try {
    dispatch({
      type: actions.USER_FETCH_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}`, config);

    dispatch({
      type: actions.USER_FETCH_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;

    dispatch({
      type: actions.USER_FETCH_FAIL,
      payload: message,
    });
  }
};

export const updateUser =
  ({ token, user, userId }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: actions.USER_UPDATE_REQUEST,
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/users/${userId}`, user, config);
      toast.success('Saved!');
      dispatch({
        type: actions.USER_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;
      toast.error(message);
      dispatch({
        type: actions.USER_UPDATE_FAIL,
        payload: message,
      });
    }
  };

export const deleteUser = (token, userId) => async (dispatch) => {
  try {
    dispatch({
      type: actions.USER_DELETE_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/employees/${userId}`, config);
    toast.success('Deleted!');
    dispatch({
      type: actions.USER_DELETE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    toast.error(message);
    dispatch({
      type: actions.USER_DELETE_FAIL,
      payload: message,
    });
  }
};

export const resetUserRedirect = () => async (dispatch) => {
  dispatch({
    type: actions.USER_RESET_REDIRECT,
  });
};
