import React from 'react';
import { Form, Card } from 'react-bootstrap';
// import Message from "../components/Message";

const TimeSheetEntry = ({ id, index, day, setJobNumber, setStartTime, setEndTime, jobNumber, startTime, endTime }) => {
  // const [startTime, setStartTime] = useState('');
  // const [endTime, setEndTime] = useState('');
  // const [jobNumber, setJobNumber] = useState('');

  const upDateArray = (updateState, state, value) => {
    updateState(state.filter((e) => e.id !== id));
    updateState([...state, { id: id, day: day, startTime: value }]);
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
              value={startTime.filter((e) => e.id === id).startTime}
              onChange={(e) => {
                upDateArray(setStartTime, startTime, e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group controlId={`end - ${id}`}>
            <Form.Label>End Time</Form.Label>
            <Form.Control type="time" value={endTime.filter((e) => e.id === id).endTime} onChange={(e) => upDateArray(setEndTime, endTime, e.target.value)} />
          </Form.Group>
          <Form.Group controlId={`job - ${id}`}>
            <Form.Label>Job Number</Form.Label>
            <Form.Control type="number" placeholder="eg - 21100" value={jobNumber.filter((e) => e.id === id).jobNumber} onChange={(e) => upDateArray(setJobNumber, jobNumber, e.target.value)} />
          </Form.Group>
        </Card.Body>
      </Card>
    </>
  );
};

export default TimeSheetEntry;

// TODO - onChange update global state for a given ID of entry
