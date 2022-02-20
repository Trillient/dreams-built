import * as actions from '../constants/jobConstants';

export const getJobsReducer = (state = { jobList: [] }, action) => {
  switch (action.type) {
    case actions.JOBLIST_FETCH_REQUEST:
      return { ...state, loading: true };
    case actions.JOBLIST_FETCH_SUCCESS:
      return { ...state, loading: false, jobList: action.payload.jobs, pages: action.payload.pages };
    case actions.JOBLIST_FETCH_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const jobReducer = (state = { job: {} }, action) => {
  switch (action.type) {
    case actions.JOB_FETCH_REQUEST:
      return { loading: true };
    case actions.JOB_FETCH_SUCCESS:
      return { loading: false, job: action.payload };
    case actions.JOB_FETCH_FAIL:
      return { loading: false, error: action.payload };
    case actions.JOB_CREATE_REQUEST:
      return { loading: true };
    case actions.JOB_CREATE_SUCCESS:
      return { loading: false, success: true, job: action.payload };
    case actions.JOB_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case actions.JOB_UPDATE_REQUEST:
      return { loading: true };
    case actions.JOB_UPDATE_SUCCESS:
      return { loading: false, success: true, job: action.payload, redirect: true };
    case actions.JOB_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case actions.JOB_DELETE_REQUEST:
      return { loading: true };
    case actions.JOB_DELETE_SUCCESS:
      return { loading: false, success: true, job: action.payload, redirect: true };
    case actions.JOB_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case actions.JOB_RESET_REDIRECT:
      return { redirect: false };
    default:
      return state;
  }
};

export const getJobPartsReducer = (state = { jobParts: [] }, action) => {
  switch (action.type) {
    case actions.JOBPARTLIST_FETCH_REQUEST:
      return { ...state, loading: true, error: false };
    case actions.JOBPARTLIST_FETCH_SUCCESS:
      return { ...state, loading: false, jobParts: action.payload.jobParts, pages: action.payload.pages, error: false };
    case actions.JOBPARTLIST_FETCH_FAIL:
      return { loading: false, error: action.payload };
    case actions.JOBPARTLIST_UPDATE_REQUEST:
      return { ...state, loading: true, error: false };
    case actions.JOBPARTLIST_UPDATE_SUCCESS:
      return { ...state, loading: false, jobParts: action.payload, error: false };
    case actions.JOBPARTLIST_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const jobPartReducer = (state = { jobPart: {} }, action) => {
  switch (action.type) {
    case actions.JOBPART_FETCH_REQUEST:
      return { loading: true };
    case actions.JOBPART_FETCH_SUCCESS:
      return { loading: false, jobPart: action.payload };
    case actions.JOBPART_FETCH_FAIL:
      return { loading: false, error: action.payload };
    case actions.JOBPART_CREATE_REQUEST:
      return { loading: true };
    case actions.JOBPART_CREATE_SUCCESS:
      return { loading: false, redirect: true, jobPart: action.payload };
    case actions.JOBPART_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case actions.JOBPART_UPDATE_REQUEST:
      return { loading: true };
    case actions.JOBPART_UPDATE_SUCCESS:
      return { loading: false, redirect: true, jobPart: action.payload };
    case actions.JOBPART_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case actions.JOBPART_DELETE_REQUEST:
      return { loading: true };
    case actions.JOBPART_DELETE_SUCCESS:
      return { loading: false, jobPart: action.payload, redirect: true };
    case actions.JOBPART_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case actions.JOBPART_RESET_REDIRECT:
      return { redirect: false };
    default:
      return state;
  }
};

export const jobDueDatesReducer = (state = { jobDueDates: [], dueDateUpdated: false }, action) => {
  switch (action.type) {
    case actions.JOBPART_DUEDATELIST_FETCH_REQUEST:
      return { loading: true };
    case actions.JOBPART_DUEDATELIST_FETCH_SUCCESS:
      return { loading: false, jobDueDates: action.payload };
    case actions.JOBPART_DUEDATELIST_FETCH_FAIL:
      return { loading: false, error: action.payload };
    case actions.JOBPART_DUEDATE_UPDATE_REQUEST:
      return { loading: true };
    case actions.JOBPART_DUEDATE_UPDATE_SUCCESS:
      return { loading: false, jobDueDate: action.payload, dueDateUpdated: true };
    case actions.JOBPART_DUEDATE_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case actions.JOBPART_DUEDATES_UPDATE_REQUEST:
      return { loading: true };
    case actions.JOBPART_DUEDATES_UPDATE_SUCCESS:
      return { loading: false, jobDueDate: action.payload, dueDateUpdated: true };
    case actions.JOBPART_DUEDATES_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case actions.JOBPART_DUEDATE_CREATE_REQUEST:
      return { loading: true };
    case actions.JOBPART_DUEDATE_CREATE_SUCCESS:
      return { loading: false, jobDueDate: action.payload, dueDateUpdated: true };
    case actions.JOBPART_DUEDATE_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case actions.JOBPART_DUEDATE_DELETE_REQUEST:
      return { loading: true };
    case actions.JOBPART_DUEDATE_DELETE_SUCCESS:
      return { loading: false, jobDueDate: action.payload, dueDateUpdated: true };
    case actions.JOBPART_DUEDATE_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case actions.JOBPART_DUEDATE_RESET:
      return { ...state, dueDateUpdated: false };
    default:
      return state;
  }
};

export const getDueDatesReducer = (state = { dueDates: [] }, action) => {
  switch (action.type) {
    case actions.DUEDATELIST_FETCH_REQUEST:
      return { dueDateLoading: true };
    case actions.DUEDATELIST_FETCH_SUCCESS:
      return { dueDateLoading: false, dueDates: action.payload };
    case actions.DUEDATELIST_FETCH_FAIL:
      return { dueDateLoading: false, dueDateError: action.payload };
    default:
      return state;
  }
};
