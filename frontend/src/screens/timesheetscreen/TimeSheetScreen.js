import React, { useEffect } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { timeSheet } from '../../actions/timeSheetActions';
import TimeSheetDay from '../../components/TimeSheetDay';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import CustomMenu from '../../components/CustomMenu';
import './timesheet.css';

const TimeSheetScreen = () => {
  const dispatch = useDispatch();

  const timeSheetData = useSelector((state) => state.timeSheetData);
  const { loading, error, timeSheetEntry } = timeSheetData;

  useEffect(() => {
    dispatch(timeSheet());
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  moment.updateLocale('en', {
    week: {
      dow: 1,
      doy: 4,
    },
  });

  const startDate = moment().startOf('week').format('DD/MM/YYYY');
  const endDate = moment().endOf('week').format('DD/MM/YYYY');

  const weekArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="background">
          <Dropdown>
            <Dropdown.Toggle id="dropdown-button" variant="primary">
              Week: {startDate} - {endDate}
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu}>
              <Dropdown.Item eventKey={endDate} active>
                {startDate} - {endDate}
              </Dropdown.Item>
              <Dropdown.Item eventKey="2">Blue</Dropdown.Item>
              <Dropdown.Item eventKey="3">Orange</Dropdown.Item>
              <Dropdown.Item eventKey="1">Red-Orange</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Form onSubmit={submitHandler}>
            {weekArray.map((day, index) => (
              <TimeSheetDay key={index} day={day} />
            ))}
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      )}
    </>
  );
};

export default TimeSheetScreen;

// TODO - fetch the timesheet data from database and set as initial state, IF empty create empty

// TODO - submit entered data onclick

// TODO - ADD date selection for timesheet week that CREATES a database entry

// TODO - PUT request on submit

// TODO - CREATES new week each sunday
