import { useEffect, useState } from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import moment from 'moment';

import { getTimeSheet, handleSubmit } from '../../actions/timeSheetActions';
import TimeSheetDay from '../../components/TimeSheetDay';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import CustomMenu from '../../components/CustomMenu';

import 'react-toastify/dist/ReactToastify.css';
import './timesheet.css';

const TimeSheetScreen = () => {
  const [dropdownTitle, setDropdownTitle] = useState('');

  const dispatch = useDispatch();

  const timeSheetData = useSelector((state) => state.timeSheetData);
  const { loading, error } = timeSheetData;

  const timeSheetEntries = useSelector((state) => state.timeSheet);
  const { dayEntries } = timeSheetEntries;

  // TODO create a use state for weekStart that is the fetched date OR the created startDate-- how to get back to current week if not filled out?

  // TODO - useEffect - getTimeSheet to take week startDate as a parameter
  useEffect(() => {
    dispatch(getTimeSheet());
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(handleSubmit(dayEntries, startDate, endDate));
  };

  moment.updateLocale('en', {
    week: {
      dow: 1,
      doy: 4,
    },
  });

  const startDate = moment().startOf('week').format('DDMMYYYY');
  const endDate = moment().endOf('week').format('DDMMYYYY');

  const weekArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // TODO - create an array that searches the last 4 weeks, then onClick will create a get request
  const dummyArray = [
    { startDate: startDate, endDate: endDate },
    { startDate: '27/09/2021', endDate: '03/10/2021' },
    { startDate: '20/09/2021', endDate: '26/09/2021' },
  ];
  const title = !dropdownTitle ? `${startDate} - ${endDate}` : `${dropdownTitle.startDate} - ${dropdownTitle.endDate}`;

  return (
    <>
      <ToastContainer theme="colored" />
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="background">
          <Form onSubmit={submitHandler}>
            <div className="grid-2">
              <Dropdown>
                <Dropdown.Toggle id="dropdown-button" variant="secondary">
                  Week: {title}
                </Dropdown.Toggle>

                <Dropdown.Menu as={CustomMenu}>
                  {dummyArray.map((date, index) => (
                    <Dropdown.Item eventKey={date.endDate} key={index} onClick={() => setDropdownTitle(date)}>
                      {date.startDate} - {date.endDate}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Button variant="primary" type="submit" className="btn-time-save">
                Save
              </Button>
            </div>
            {weekArray.map((day) => (
              <TimeSheetDay key={day} day={day} />
            ))}
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </div>
      )}
    </>
  );
};

export default withAuthenticationRequired(TimeSheetScreen, {
  onRedirecting: () => <Loader />,
});

// TODO - fetch the timesheet data from database and set as initial state, IF empty create empty
