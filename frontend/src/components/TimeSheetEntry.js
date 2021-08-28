import React from "react";
import { Form, Card, Button } from "react-bootstrap";

const TimeSheetEntry = ({ day }) => {
  return (
    <Card className="mt-5 mb-5">
      <Card.Body>
        <h2>{day}</h2>
        <Form.Group className="mb-3" controlId="formTimeSheetStartTime">
          <Form.Label>Start Time</Form.Label>
          <Form.Control type="time" placeholder="Enter email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formTimeSheetEndTime">
          <Form.Label>End Time</Form.Label>
          <Form.Control type="time" placeholder="Password" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formTimeSheetJobNumber">
          <Form.Label>Job Number</Form.Label>
          <Form.Control type="number" placeholder="eg - 21100" />
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default TimeSheetEntry;
