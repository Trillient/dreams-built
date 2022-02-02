import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const TimesheetEntryModal = ({ setModalShow, entry, ...rest }) => {
  const [startTime, setStartTime] = useState(entry.startTime);
  const [endTime, setEndTime] = useState(entry.endTime);
  const [jobNumber, setJobNumber] = useState(entry.jobNumber);

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <Modal {...rest} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1>{entry.day}</h1>
        </Modal.Title>
        <Button variant="secondary" onClick={() => setModalShow(false)}>
          Close
        </Button>
      </Modal.Header>
      <Modal.Body>
        <h2>
          {entry.user.firstName} {entry.user.lastName}
        </h2>
        <p>
          <em>{entry.entryId}</em>
        </p>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="startTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}></Form.Control>
          </Form.Group>
          <Form.Group controlId="endTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}></Form.Control>
          </Form.Group>
          <Form.Group controlId="jobNumber">
            <Form.Label>Job Number</Form.Label>
            <Form.Control type="number" value={jobNumber} onChange={(e) => setJobNumber(e.target.value)}></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">
            Save
          </Button>
          <Button variant="danger">Delete</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TimesheetEntryModal;
