import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { entryArrayReducer, validateReducer } from './reducers/timeSheetReducer';
import { getJobPartsReducer, getJobsReducer, jobPartReducer, jobReducer } from './reducers/jobReducer';
import { clientReducer, getClientsReducer } from './reducers/clientReducer';
import { getEmployeesReducer } from './reducers/employeeReduer';

const reducer = combineReducers({
  timeSheet: entryArrayReducer,
  validatedTimesheet: validateReducer,
  jobsList: getJobsReducer,
  job: jobReducer,
  jobParts: getJobPartsReducer,
  jobPart: jobPartReducer,
  clients: getClientsReducer,
  client: clientReducer,
  employees: getEmployeesReducer,
});

const middleware = [thunk];

const store = createStore(reducer, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
