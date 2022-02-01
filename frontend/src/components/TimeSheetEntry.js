import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { updateEntry } from '../actions/timesheetActions';

import styles from '../screens/timesheetScreen/timesheet.module.css';

const TimeSheetEntry = ({ entryId, day }) => {
  const dispatch = useDispatch();

  const timesheetEntries = useSelector((state) => state.timesheet);
  const { dayEntries } = timesheetEntries;
  const jobsList = useSelector((state) => state.jobsList);
  const { jobList } = jobsList;
  const entry = dayEntries.filter((entry) => entry.entryId === entryId);

  if (entry.length > 1) {
    throw new Error('Duplicate entries, contact support');
  }

  const initStartTime = entry.length === 1 ? entry[0].startTime : '';
  const initEndTime = entry.length === 1 ? entry[0].endTime : '';
  const initjobNumber = entry.length === 1 ? entry[0].jobNumber : '';

  const [startTime, setStartTime] = useState(initStartTime || '');
  const [endTime, setEndTime] = useState(initEndTime || '');
  const [jobNumber, setjobNumber] = useState(initjobNumber || '');

  const initjobAddress = jobList ? jobList.filter((job) => job.jobNumber === jobNumber).map((job) => job.address) : '';
  const [jobAddress, setJobAddress] = useState(initjobAddress || '');

  useEffect(() => {
    dispatch(updateEntry(startTime, endTime, jobNumber, entryId, day, time));
    if (jobList) {
      setJobAddress(jobList.filter((job) => job.jobNumber === parseInt(jobNumber)).map((job) => job.address));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime, jobNumber]);

  let time;
  if (startTime && endTime) {
    const a = endTime.split(':');
    const timeA = +a[0] + +a[1] / 60;
    const b = startTime.split(':');
    const timeB = +b[0] + +b[1] / 60;
    time = (timeA - timeB).toFixed(2);
  }

  return (
    <>
      <td>
        <Form.Group controlId={`start - ${entryId}`}>
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
        <Form.Group controlId={`end - ${entryId}`}>
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
        <Form.Group controlId={`job - ${entryId}`}>
          <Form.Label className="display-none_lg-screen">Job Number: </Form.Label>
          <Form.Control
            className={styles.select}
            as="select"
            value={jobNumber}
            onChange={(e) => {
              setjobNumber(e.target.value);
              setJobAddress(jobList.filter((job) => job.jobNumber === parseInt(e.target.value)).map((job) => job.address));
            }}
          >
            <option value={jobNumber}>
              {jobNumber} - {jobAddress}
            </option>
            <option disabled>------------------------</option>
            {jobList &&
              jobList.map((job) => (
                <option value={job.jobNumber} key={job._id}>
                  {job.jobNumber} - {job.address}
                </option>
              ))}
          </Form.Control>
        </Form.Group>
      </td>
      <td className="right-align">
        <strong className="display-none_lg-screen">Total:</strong> {time > 0 ? time : 0} <span className="display-none_lg-screen">hours</span>
      </td>
    </>
  );
};

export default TimeSheetEntry;
