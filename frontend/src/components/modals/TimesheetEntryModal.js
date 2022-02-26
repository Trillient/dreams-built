import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';

import { deleteEmployeeTimesheetEntry, updateEmployeeTimesheetEntry } from '../../actions/reportActions';

import styles from './timesheetEntryModal.module.css';

const TimesheetEntryModal = ({ setModalShow, entry, ...rest }) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#ddd' : job ? '#ddd' : 'red',
      '&:hover': {
        borderColor: state.isFocused ? '#ddd' : job ? '#ddd' : 'red',
      },
    }),
  };

  const jobsList = useSelector((state) => state.jobsList);
  const { jobList } = jobsList;

  const defaultLabel = entry.job ? { ...entry.job, label: `${entry.job.jobNumber} - ${entry.job.address}`, value: entry.job._id } : '';

  const [startTime, setStartTime] = useState(entry.startTime || '');
  const [endTime, setEndTime] = useState(entry.endTime || '');
  const [job, setJob] = useState(defaultLabel);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (job) {
      const token = await getAccessTokenSilently();
      dispatch(updateEmployeeTimesheetEntry(token, entry._id, startTime, endTime, job.value));
      setModalShow(false);
    } else {
      toast.error('Missing Job!');
    }
  };

  const handleDelete = async () => {
    const token = await getAccessTokenSilently();
    dispatch(deleteEmployeeTimesheetEntry(token, entry._id));
    setModalShow(false);
  };

  return (
    rest.show && (
      <Modal {...rest} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h1 style={{ fontSize: '2.2rem' }}>{entry.day}</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h2 style={{ fontSize: '1.7rem' }}>
            {entry.user.firstName} {entry.user.lastName}
          </h2>
          <p>
            <em>{entry.entryId}</em>
          </p>
          <Form onSubmit={handleSubmit} className={styles.form}>
            <Form.Group controlId="startTime">
              <Form.Label>Start Time:</Form.Label>
              <Form.Control type="time" isInvalid={!startTime} value={startTime} onChange={(e) => setStartTime(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="endTime">
              <Form.Label>End Time:</Form.Label>
              <Form.Control type="time" isInvalid={!endTime} value={endTime} onChange={(e) => setEndTime(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Job Number: </Form.Label>
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

            <Button type="submit" variant="success" style={{ marginTop: '1rem' }}>
              Save
            </Button>
            <Button onClick={handleDelete} variant="danger">
              Delete
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    )
  );
};

export default TimesheetEntryModal;
