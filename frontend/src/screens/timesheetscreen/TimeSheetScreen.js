import React, { useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { timeSheet } from '../../actions/timeSheetActions';
import TimeSheetDay from '../../components/TimeSheetDay';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
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

  const startDate = moment().startOf('week');
  const endDate = moment().endOf('week');

  const weekArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="background">
          <p>
            Week: {startDate.format('DD/MM/YYYY')} - {endDate.format('DD/MM/YYYY')}
          </p>
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
