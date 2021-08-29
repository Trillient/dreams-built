import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import TimeSheetDay from "../../components/TimeSheetDay";
import "./timesheet.css";

const TimeSheetScreen = () => {
  const [dayEntry, setDayEntry] = useState([]);
  const submitHandler = (e) => {
    e.preventDefault();

    console.log(dayEntry);
  };
  return (
    <div className="background">
      <Form onSubmit={submitHandler}>
        <TimeSheetDay day="Monday" setDayEntry={setDayEntry} />
        <TimeSheetDay day="Tuesday" setDayEntry={setDayEntry} />
        <TimeSheetDay day="Wednesday" setDayEntry={setDayEntry} />
        <TimeSheetDay day="Thursday" setDayEntry={setDayEntry} />
        <TimeSheetDay day="Friday" setDayEntry={setDayEntry} />
        <TimeSheetDay day="Saturday" setDayEntry={setDayEntry} />
        <TimeSheetDay day="Sunday" setDayEntry={setDayEntry} />

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default TimeSheetScreen;
