import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { entryArrayReducer, validateReducer } from './reducers/timesheetReducer';
import { jobDueDatesReducer, getJobPartsReducer, getJobsReducer, jobPartReducer, jobReducer, getDueDatesReducer } from './reducers/jobReducer';
import { clientReducer, getClientsReducer } from './reducers/clientReducer';
import { getEmployeesReducer, userReducer } from './reducers/employeeReduer';
import { reportReducer } from './reducers/reportsReducer';

const reducer = combineReducers({
  timesheet: entryArrayReducer,
  validatedTimesheet: validateReducer,
  jobsList: getJobsReducer,
  job: jobReducer,
  jobParts: getJobPartsReducer,
  jobPart: jobPartReducer,
  clients: getClientsReducer,
  client: clientReducer,
  employees: getEmployeesReducer,
  employee: userReducer,
  jobDueDates: jobDueDatesReducer,
  dueDateList: getDueDatesReducer,
  reports: reportReducer,
});

const middleware = [thunk];

const store = createStore(reducer, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
