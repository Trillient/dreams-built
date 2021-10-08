import React, { useEffect, useState } from 'react';
import { Form, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateEntry } from '../actions/timeSheetActions';

// import Message from "../components/Message";

const TimeSheetEntry = ({ id, index, day }) => {
  const dispatch = useDispatch();

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [jobNumber, setJobNumber] = useState('');

  const timeSheetEntries = useSelector((state) => state.timeSheet);
  const { dayEntries } = timeSheetEntries;

  const entry = dayEntries.filter((e) => e.id === id);

  useEffect(() => {
    setStartTime(entry[0].startTime || '');
    setEndTime(entry[0].endTime || '');
    setJobNumber(entry[0].jobNumber || '');
  }, []);

  useEffect(() => {
    dispatch(updateEntry(startTime, endTime, jobNumber, id, day));
  }, [startTime, endTime, jobNumber]);

  const getBackgroundColor = (value) => {
    let color;
    if (value % 2 === 0) {
      color = '#DDDCDA';
    }
    return color;
  };
  const a = endTime.split(':');
  const timeA = +a[0] + +a[1] / 60;
  const b = startTime.split(':');
  const timeB = +b[0] + +b[1] / 60;
  const time = (timeA - timeB).toFixed(2);

  return (
    <>
      <Card className="p-3" style={{ backgroundColor: getBackgroundColor(index) }}>
        <Card.Body className="timesheet-grid">
          <Form.Group controlId={`start - ${id}`}>
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group controlId={`end - ${id}`}>
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="time"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group controlId={`job - ${id}`}>
            <Form.Label>Job Number</Form.Label>
            <Form.Control
              type="number"
              placeholder="eg - 21100"
              value={jobNumber}
              onChange={(e) => {
                setJobNumber(e.target.value);
              }}
            />
          </Form.Group>
          <p>Total: {time > 0 ? time : null}</p>
        </Card.Body>
      </Card>
    </>
  );
};

export default TimeSheetEntry;

// TODO - onChange update global state for a given ID of entry
