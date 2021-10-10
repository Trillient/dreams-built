import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { getTimeSheetReducer, entryArrayReducer, validateReducer } from './reducers/timeSheetReducer';

const reducer = combineReducers({
  timeSheetData: getTimeSheetReducer,
  timeSheet: entryArrayReducer,
  validatedTimesheet: validateReducer,
});

const timeSheetDataFromStorage = localStorage.getItem('timeSheetData') ? JSON.parse(localStorage.getItem('timeSheetData')) : [];

const initialState = {
  timeSheetData: timeSheetDataFromStorage,
};

const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
