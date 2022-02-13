import axios from 'axios';
import { toast } from 'react-toastify';

import * as actions from '../constants/employeeConstants';

export const getEmployees =
  (token, limit = '', page = '', search = '') =>
  async (dispatch) => {
    try {
      dispatch({
        type: actions.EMPLOYEELIST_FETCH_REQUEST,
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users?limit=${limit}&page=${page}&keyword=${search}`, config);

      dispatch({
        type: actions.EMPLOYEELIST_FETCH_SUCCESS,
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

    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/users/user/${userId}`, config);

    dispatch({
      type: actions.USER_FETCH_SUCCESS,
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

      const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/users/user/${userId}`, user, config);
      toast.success('Saved!');
      dispatch({
        type: actions.USER_UPDATE_SUCCESS,
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

    const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/users/user/${userId}`, config);
    toast.success('Deleted!');
    dispatch({
      type: actions.USER_DELETE_SUCCESS,
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
      type: actions.USER_DELETE_FAIL,
      payload: message,
    });
  }
};

export const addRole = (token, userId, role) => async (dispatch) => {
  try {
    dispatch({
      type: actions.USER_ADD_ROLE_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/users/roles/user/${userId}?role=${role}`, {}, config);

    dispatch({
      type: actions.USER_ADD_ROLE_SUCCESS,
      payload: data,
    });
    toast.success('Saved!');
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.response.data.errors ? error.response.data.errors : error.message;

    if (error.response.data.errors && message.length > 0) {
      message.map((err) => toast.error(err.msg));
    } else {
      toast.error(message);
    }
    dispatch({
      type: actions.USER_ADD_ROLE_FAIL,
      payload: message,
    });
  }
};

export const deleteRole = (token, userId, role) => async (dispatch) => {
  try {
    dispatch({
      type: actions.USER_DELETE_ROLE_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/users/roles/user/${userId}?role=${role}`, config);

    dispatch({
      type: actions.USER_DELETE_ROLE_SUCCESS,
      payload: data,
    });
    toast.success('Deleted!');
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.response.data.errors ? error.response.data.errors : error.message;
    if (error.response.data.errors && message.length > 0) {
      message.map((err) => toast.error(err.msg));
    } else {
      toast.error(message);
    }
    dispatch({
      type: actions.USER_DELETE_ROLE_FAIL,
      payload: message,
    });
  }
};

export const resetUserRedirect = () => async (dispatch) => {
  dispatch({
    type: actions.USER_RESET_REDIRECT,
  });
};
