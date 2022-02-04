import axios from 'axios';
import { toast } from 'react-toastify';

import * as actions from '../constants/clientConstants';

export const getClients = (token, limit, page) => async (dispatch) => {
  try {
    dispatch({
      type: actions.CLIENTLIST_FETCH_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/clients?limit=${limit}&page=${page}`, config);

    dispatch({
      type: actions.CLIENTLIST_FETCH_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;

    dispatch({
      type: actions.CLIENTLIST_FETCH_FAIL,
      payload: message,
    });
  }
};

export const getClient = (token, clientId) => async (dispatch) => {
  try {
    dispatch({
      type: actions.CLIENT_FETCH_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/clients/${clientId}`, config);

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

export const createClient =
  ({ token, client }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: actions.CLIENT_CREATE_REQUEST,
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/clients`, client, config);
      toast.success('Saved!');
      dispatch({
        type: actions.CLIENT_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;
      toast.error(message);
      dispatch({
        type: actions.CLIENT_CREATE_FAIL,
        payload: message,
      });
    }
  };

export const updateClient =
  ({ token, client, clientId }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: actions.CLIENT_UPDATE_REQUEST,
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/clients/${clientId}`, client, config);
      toast.success('Saved!');
      dispatch({
        type: actions.CLIENT_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;
      toast.error(message);
      dispatch({
        type: actions.CLIENT_UPDATE_FAIL,
        payload: message,
      });
    }
  };

export const deleteClient = (token, clientId) => async (dispatch) => {
  try {
    dispatch({
      type: actions.CLIENT_DELETE_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/clients/${clientId}`, config);
    toast.success('Deleted!');
    dispatch({
      type: actions.CLIENT_DELETE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.message;
    toast.error(message);
    dispatch({
      type: actions.CLIENT_DELETE_FAIL,
      payload: message,
    });
  }
};

export const resetClientRedirect = () => async (dispatch) => {
  dispatch({
    type: actions.RESET_REDIRECT,
  });
};
