import * as actions from '../constants/contactConstants';

export const contactReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.CONTACT_FORM_POST_REQUEST:
      return { contactFormLoading: true };
    case actions.CONTACT_FORM_POST_SUCCESS:
      return { contactFormLoading: false, contactFormSuccess: true };
    case actions.CONTACT_FORM_POST_RESET:
      return { contactFormLoading: false, contactFormSuccess: false };
    case actions.CONTACT_FORM_POST_FAIL:
      return { contactFormLoading: false, error: action.payload };
    default:
      return state;
  }
};
