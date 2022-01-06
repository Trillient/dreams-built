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
