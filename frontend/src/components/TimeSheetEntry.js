import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';

import { updateEntry } from '../actions/timesheetActions';

const TimesheetEntry = ({ entryId, day }) => {
  const customStyles = {
    control: (base, state) => ({
      ...base,
      // state.isFocused can display different borderColor if you need it
      borderColor: state.isFocused ? '#ddd' : !jobError ? '#ddd' : 'red',
      // overwrittes hover style
      '&:hover': {
        borderColor: state.isFocused ? '#ddd' : !jobError ? '#ddd' : 'red',
      },
    }),
  };

  const dispatch = useDispatch();

  const timesheetEntries = useSelector((state) => state.timesheet);
  const { dayEntries } = timesheetEntries;
  const timesheetErrors = useSelector((state) => state.validatedTimesheet);
  const { clientValidationErrors } = timesheetErrors;
  const jobsList = useSelector((state) => state.jobsList);
  const { jobList } = jobsList;

  const entry = dayEntries.filter((entry) => entry.entryId === entryId);
  const validationError = clientValidationErrors && clientValidationErrors.filter((entry) => entry.entryId === entryId);

  if (entry.length > 1) {
    throw new Error('Duplicate entries, contact support');
  }

  const initStartTime = entry.length === 1 ? entry[0].startTime : '';
  const initEndTime = entry.length === 1 ? entry[0].endTime : '';
  const initjobNumber = entry.length === 1 ? entry[0].job : '';

  const [startTime, setStartTime] = useState(initStartTime || '');
  const [endTime, setEndTime] = useState(initEndTime || '');
  const [job, setJob] = useState(initjobNumber || '');
  const [jobError, setJobError] = useState(false);
  const [timeError, setTimeError] = useState(false);

  const defaultLabel = job ? { label: `${job.jobNumber} - ${job.address}` } : '';

  useEffect(() => {
    dispatch(updateEntry(startTime, endTime, job, entryId, day, time));

    if (validationError) {
      if (startTime && endTime && time > 0) {
        setTimeError(false);
      } else {
        validationError.filter((entry) => entry.error === 'time')[0] ? setTimeError(true) : setTimeError(false);
      }

      if (job) {
        setJobError(false);
      } else {
        validationError.filter((entry) => entry.error === 'job')[0] ? setJobError(true) : setJobError(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime, job, clientValidationErrors, entryId, day]);

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
            isInvalid={timeError}
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
            isInvalid={timeError}
          />
        </Form.Group>
      </td>
      <td>
        <Form.Group controlId={`job - ${entryId}`}>
          <Form.Label className="display-none_lg-screen">Job Number: </Form.Label>
          <Select
            styles={customStyles}
            menuPosition={'fixed'}
            isClearable="true"
            defaultValue={defaultLabel}
            onChange={setJob}
            options={
              jobList &&
              jobList.map((option) => {
                return { ...option, label: `${option.jobNumber} - ${option.address}, ${option.city}`, value: option._id };
              })
            }
          />
        </Form.Group>
      </td>
      <td className="right-align">
        <strong className="display-none_lg-screen">Total:</strong> {time > 0 ? time : 0} <span className="display-none_lg-screen">hours</span>
      </td>
    </>
  );
};

export default TimesheetEntry;
