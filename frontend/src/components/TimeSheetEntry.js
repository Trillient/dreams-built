import React, { useState } from 'react';
import { Form, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
// import Message from "../components/Message";

const TimeSheetEntry = ({ id, index, day, inputList, setInputList }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [jobNumber, setJobNumber] = useState('');

  const upDateArray = (state, value) => {
    const startTimeValue = state === setStartTime ? value : startTime;
    const endTimeValue = state === setEndTime ? value : endTime;
    const jobNumberValue = state === setJobNumber ? value : jobNumber;
    setInputList(
      inputList.map((item) => {
        if (item.id === id) {
          return {
            id: id,
            day: day,
            startTime: startTimeValue,
            endTime: endTimeValue,
            jobNumber: jobNumberValue,
          };
        }
        return item;
      })
    );
  };

  const getBackgroundColor = (value) => {
    let color;
    if (value % 2 === 0) {
      color = '#DDDCDA';
    }
    return color;
  };

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
                upDateArray(setStartTime, e.target.value);
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
                upDateArray(setEndTime, e.target.value);
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
                upDateArray(setJobNumber, e.target.value);
              }}
            />
          </Form.Group>
        </Card.Body>
      </Card>
    </>
  );
};

export default TimeSheetEntry;

// TODO - onChange update global state for a given ID of entry
