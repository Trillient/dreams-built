import axios from 'axios';

import * as actions from '../constants/clientConstants';

export const getClientList = (token) => async (dispatch) => {
  try {
    dispatch({
      type: actions.CLIENTLIST_FETCH_REQUEST,
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/clients`, config);

    dispatch({
      type: actions.JOBLIST_FETCH_SUCCESS,
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
