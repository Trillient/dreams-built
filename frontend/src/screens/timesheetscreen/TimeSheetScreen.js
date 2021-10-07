import React, { useEffect, useState } from 'react';
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
  const [dropdownTitle, setDropdownTitle] = useState('');

  const dispatch = useDispatch();

  const timeSheetData = useSelector((state) => state.timeSheetData);
  const { loading, error, timeSheetEntry } = timeSheetData;
  const [startTime, setStartTime] = useState([]);
  const [endTime, setEndTime] = useState([]);
  const [jobNumber, setJobNumber] = useState([]);

  console.log(startTime);

  useEffect(() => {
    dispatch(timeSheet());
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    const submittedData = {
      startTimes: startTime,
      endTimes: endTime,
      jobNumber: jobNumber,
    };
    console.log(submittedData);
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
  const dummyArray = [
    { startDate: startDate, endDate: endDate },
    { startDate: '27/09/2021', endDate: '03/10/2021' },
    { startDate: '20/09/2021', endDate: '26/09/2021' },
  ];
  const title = !dropdownTitle ? `${startDate} - ${endDate}` : `${dropdownTitle.startDate} - ${dropdownTitle.endDate}`;

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
              Week: {title}
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu}>
              {dummyArray.map((date, index) => (
                <Dropdown.Item eventKey={date.endDate} key={index} onClick={(e) => setDropdownTitle(date)}>
                  {date.startDate} - {date.endDate}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Form onSubmit={submitHandler}>
            {weekArray.map((day, index) => (
              <TimeSheetDay key={index} day={day} setEndTime={setEndTime} setStartTime={setStartTime} setJobNumber={setJobNumber} endTime={endTime} startTime={startTime} jobNumber={jobNumber} />
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
