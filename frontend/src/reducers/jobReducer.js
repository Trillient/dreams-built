import * as actions from '../constants/jobConstants';

export const getJobsReducer = (state = { jobList: [] }, action) => {
  switch (action.type) {
    case actions.JOBLIST_FETCH_REQUEST:
      return { loading: true };
    case actions.JOBLIST_FETCH_SUCCESS:
      return { loading: false, jobList: action.payload };
    case actions.JOBLIST_FETCH_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const jobCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.JOB_CREATE_REQUEST:
      return { loading: true };
    case actions.JOB_CREATE_SUCCESS:
      return { loading: false, success: true, job: action.payload };
    case actions.JOB_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const getClientsReducer = (state = { clientList: [] }, action) => {
  switch (action.type) {
    case actions.CLIENT_FETCH_REQUEST:
      return { loading: true };
    case actions.CLIENT_FETCH_SUCCESS:
      return { loading: false, clientList: action.payload };
    case actions.CLIENT_FETCH_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};