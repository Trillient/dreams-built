import axios from 'axios';
import { toast } from 'react-toastify';

import * as actions from '../constants/contactConstants';

export const contactFormPost = (name, email, message, token) => async (dispatch) => {
  try {
    dispatch({
      type: actions.CONTACT_FORM_POST_REQUEST,
    });

    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/contact`, { name: name, email: email, message: message, token: token });

    toast.success('Sent!');

    dispatch({
      type: actions.CONTACT_FORM_POST_SUCCESS,
      payload: data,
    });

    dispatch({
      type: actions.CONTACT_FORM_POST_RESET,
    });
  } catch (error) {
    const message = error.response && error.response.data.message ? error.response.data.message : error.response.data.errors ? error.response.data.errors : error.message;

    if (error.response.data.errors && message.length > 0) {
      message.map((err) => toast.error(err.msg));
    } else {
      toast.error(message);
    }

    dispatch({
      type: actions.CONTACT_FORM_POST_FAIL,
      payload: message,
    });
  }
};
