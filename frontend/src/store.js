import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { entryArrayReducer, validateReducer } from './reducers/timeSheetReducer';
import { getClientsReducer, getJobsReducer, jobCreateReducer, getJobReducer } from './reducers/jobReducer';

const reducer = combineReducers({
  timeSheet: entryArrayReducer,
  validatedTimesheet: validateReducer,
  jobCreation: jobCreateReducer,
  clients: getClientsReducer,
  jobsList: getJobsReducer,
  job: getJobReducer,
});

const middleware = [thunk];

const store = createStore(reducer, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
