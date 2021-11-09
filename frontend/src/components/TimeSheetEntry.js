import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { updateEntry } from '../actions/timeSheetActions';

// import Message from "../components/Message";

const TimeSheetEntry = ({ id, day }) => {
  const dispatch = useDispatch();

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [jobNumber, setJobNumber] = useState('');

  const timeSheetEntries = useSelector((state) => state.timeSheet);
  const { dayEntries } = timeSheetEntries;

  const entry = dayEntries.filter((e) => e.id === id);

  useEffect(() => {
    setStartTime(entry[0].startTime || '');
    setEndTime(entry[0].endTime || '');
    setJobNumber(entry[0].jobNumber || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(updateEntry(startTime, endTime, jobNumber, id, day, time));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime, jobNumber]);

  const a = endTime.split(':');
  const timeA = +a[0] + +a[1] / 60;
  const b = startTime.split(':');
  const timeB = +b[0] + +b[1] / 60;
  const time = (timeA - timeB).toFixed(2);

  return (
    <>
      <td>
        <Form.Group controlId={`start - ${id}`}>
          <Form.Label className="display-none_lg-screen">Start Time: </Form.Label>
          <Form.Control
            type="time"
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
            }}
          />
        </Form.Group>
      </td>
      <td>
        <Form.Group controlId={`end - ${id}`}>
          <Form.Label className="display-none_lg-screen">End Time: </Form.Label>
          <Form.Control
            type="time"
            value={endTime}
            onChange={(e) => {
              setEndTime(e.target.value);
            }}
          />
        </Form.Group>
      </td>
      <td>
        <Form.Group controlId={`job - ${id}`}>
          <Form.Label className="display-none_lg-screen">Job Number: </Form.Label>
          <Form.Control
            type="number"
            placeholder="eg - 21100"
            value={jobNumber}
            onChange={(e) => {
              setJobNumber(e.target.value);
            }}
          />
        </Form.Group>
      </td>
      <td className="right-align">
        <strong className="display-none_lg-screen">Total:</strong> {time > 0 ? time : 0} <span className="display-none_lg-screen">hours</span>
      </td>
    </>
  );
};

export default TimeSheetEntry;

// TODO - onChange update global state for a given ID of entry
