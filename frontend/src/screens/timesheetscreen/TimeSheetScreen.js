import React from "react";
import { Form, Button } from "react-bootstrap";
import TimeSheetDay from "../../components/TimeSheetDay";
import "./timesheet.css";

const TimeSheetScreen = () => {
  const submitHandler = (e) => {
    e.preventDefault();

    console.log(e);
  };
  return (
    <div className="background">
      <Form onSubmit={submitHandler}>
        <TimeSheetDay day="Monday" />
        <TimeSheetDay day="Tuesday" />
        <TimeSheetDay day="Wednesday" />
        <TimeSheetDay day="Thursday" />
        <TimeSheetDay day="Friday" />
        <TimeSheetDay day="Saturday" />
        <TimeSheetDay day="Sunday" />

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default TimeSheetScreen;
