import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { entryArrayReducer, validateReducer } from './reducers/timeSheetReducer';
import { getJobsReducer, jobCreateReducer, getJobReducer } from './reducers/jobReducer';
import { createClientReducer, getClientsReducer } from './reducers/clientReducer';

const reducer = combineReducers({
  timeSheet: entryArrayReducer,
  validatedTimesheet: validateReducer,
  jobCreation: jobCreateReducer,
  jobsList: getJobsReducer,
  job: getJobReducer,
  clients: getClientsReducer,
  client: createClientReducer,
});

const middleware = [thunk];

const store = createStore(reducer, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
