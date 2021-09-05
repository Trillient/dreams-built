import React, { useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { timeSheet } from "../../actions/timeSheetActions";
import TimeSheetDay from "../../components/TimeSheetDay";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import "./timesheet.css";

const TimeSheetScreen = () => {
  const dispatch = useDispatch();

  const timeSheetData = useSelector((state) => state.timeSheetData);
  const { loading, error, timeSheetEntry } = timeSheetData;

  useEffect(() => {
    dispatch(timeSheet());
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="background">
          <Form onSubmit={submitHandler}>
            <TimeSheetDay day="Monday" />
            <TimeSheetDay day="Tuesday" />
            {/* <TimeSheetDay day="Wednesday" />
            <TimeSheetDay day="Thursday" />
            <TimeSheetDay day="Friday" />
            <TimeSheetDay day="Saturday" />
            <TimeSheetDay day="Sunday" /> */}

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      )}
    </>
  );
};

export default TimeSheetScreen;
