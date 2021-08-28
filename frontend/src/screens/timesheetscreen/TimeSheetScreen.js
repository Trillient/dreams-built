import React from "react";
import { Form, Button } from "react-bootstrap";
import TimeSheetEntry from "../../components/TimeSheetEntry";

const TimeSheetScreen = () => {
  return (
    <div>
      <Form>
        <TimeSheetEntry />

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default TimeSheetScreen;
