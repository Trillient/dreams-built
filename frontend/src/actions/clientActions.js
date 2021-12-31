import axios from 'axios';

import * as actions from '../constants/clientConstants';

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
