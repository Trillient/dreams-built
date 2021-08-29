import React from "react";
import { Form, Card } from "react-bootstrap";

const TimeSheetEntry = ({ id }) => {
  const getBackgroundColor = (value) => {
    let color;
    if (value % 2 === 0) {
      color = "#DDDCDA";
    }
    return color;
  };

  return (
    <div>
      <Card className="p-3" style={{ backgroundColor: getBackgroundColor(id) }}>
        <Card.Body className="timesheet-grid">
          <Form.Group controlId="formTimeSheetStartTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control type="time" />
          </Form.Group>
          <Form.Group controlId="formTimeSheetEndTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control type="time" />
          </Form.Group>
          <Form.Group controlId="formTimeSheetJobNumber">
            <Form.Label>Job Number</Form.Label>
            <Form.Control type="number" placeholder="eg - 21100" />
          </Form.Group>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TimeSheetEntry;
