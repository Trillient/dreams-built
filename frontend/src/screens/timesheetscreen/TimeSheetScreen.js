import React from "react";
import { Form, Button } from "react-bootstrap";
import TimeSheetDay from "../../components/TimeSheetDay";

const TimeSheetScreen = () => {
  return (
    <div>
      <Form>
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
