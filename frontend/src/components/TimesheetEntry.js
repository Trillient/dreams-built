import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';

import { updateEntry } from '../actions/timesheetActions';

const TimesheetEntry = ({ entryId, day }) => {
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#ddd' : !jobError ? '#ddd' : 'red',
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
  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);

  const defaultLabel = job ? { label: `${job.jobNumber} - ${job.address}` } : '';

  useEffect(() => {
    dispatch(updateEntry(startTime, endTime, job, entryId, day, time));

    if (validationError) {
      if (startTime && endTime && time > 0) {
        setStartTimeError(false);
        setEndTimeError(false);
      } else {
        if (validationError.filter((entry) => entry.error === 'startTime')[0]) {
          setStartTimeError(true);
        } else if (validationError.filter((entry) => entry.error === 'endTime')[0]) {
          setEndTimeError(true);
        } else if (validationError.filter((entry) => entry.error === 'time')[0]) {
          setStartTimeError(true);
          setEndTimeError(true);
        }
      }

      if (job) {
        setJobError(false);
      } else {
        validationError.filter((entry) => entry.error === 'job')[0] && setJobError(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime, job, clientValidationErrors, entryId, day]);

  let time;
  if (startTime && endTime) {
    time = (DateTime.fromFormat(endTime, 'hh:mm').diff(DateTime.fromFormat(startTime, 'hh:mm'), 'seconds', 'minutes').toFormat('mm') / 60).toFixed(2);
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
            isInvalid={startTimeError}
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
            isInvalid={endTimeError}
          />
        </Form.Group>
      </td>
      <td>
        <Form.Group controlId={`job - ${entryId}`}>
          <Form.Label className="display-none_lg-screen">Job Number: </Form.Label>
          <Select
            styles={customStyles}
            menuPosition={'fixed'}
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
        <strong className="display-none_lg-screen">Total:</strong> {time} <span className="display-none_lg-screen">hours</span>
      </td>
    </>
  );
};

export default TimesheetEntry;
