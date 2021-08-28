import React from "react";
import { Card } from "react-bootstrap";
import TimeSheetEntry from "./TimeSheetEntry";

const TimeSheetDay = ({ day }) => {
  return (
    <Card className="mt-5 mb-5">
      <Card.Body>
        <h2>{day}</h2>
        <TimeSheetEntry key={day} />
      </Card.Body>
    </Card>
  );
};

export default TimeSheetDay;
