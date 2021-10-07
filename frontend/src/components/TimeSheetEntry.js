import React, { useState } from 'react';
import { Form, Card } from 'react-bootstrap';
// import Message from "../components/Message";

const TimeSheetEntry = ({ name, index }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [jobNumber, setJobNumber] = useState('');

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
          <Form.Group controlId={`start${name}`}>
            <Form.Label>Start Time</Form.Label>
            <Form.Control type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </Form.Group>
          <Form.Group controlId={`end${name}`}>
            <Form.Label>End Time</Form.Label>
            <Form.Control type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </Form.Group>
          <Form.Group controlId={`job${name}`}>
            <Form.Label>Job Number</Form.Label>
            <Form.Control type="number" placeholder="eg - 21100" value={jobNumber} onChange={(e) => setJobNumber(e.target.value)} />
          </Form.Group>
        </Card.Body>
      </Card>
    </>
  );
};

export default TimeSheetEntry;

// TODO - onChange update global state for a given ID of entry
