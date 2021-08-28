import React from "react";
import { Form, Button } from "react-bootstrap";

const TimeSheetEntry = () => {
  return (
    <div>
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
    </div>
  );
};

export default TimeSheetEntry;
