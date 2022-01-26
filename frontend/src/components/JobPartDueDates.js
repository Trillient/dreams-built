import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { createJobPartDueDate, deleteJobPartDueDate, updateJobPartDueDate } from '../actions/jobActions';

const JobPartDueDates = ({ jobPart, jobId }) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const dueDates = useSelector((state) => state.jobDueDates);
  const { loading, jobDueDates } = dueDates;

  const [dueDate, setDueDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDateStore, setDueDateStore] = useState('');

  useEffect(() => {
    if (!loading && jobDueDates) {
      const data = jobDueDates.find((dueDate) => dueDate.jobPartTitle._id === jobPart._id && dueDate.job === jobId);
      setDueDateStore(data);
    }
    if (dueDateStore) {
      setDueDate(dueDateStore.dueDate);
      setStartDate(dueDateStore.startDate);
    }
  }, [loading, jobDueDates, dueDateStore, jobPart._id, jobId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    if (dueDateStore) {
      dispatch(updateJobPartDueDate(token, dueDateStore._id, dueDate, startDate));
    } else {
      dispatch(createJobPartDueDate(token, jobId, jobPart._id, dueDate, startDate));
    }
  };

  const handleDelete = async () => {
    const token = await getAccessTokenSilently();
    if (dueDateStore) {
      dispatch(deleteJobPartDueDate(token, dueDateStore._id));
    } else {
      toast.info('Due date does not exist');
    }
  };
  return (
    <>
      <ToastContainer theme="colored" />
      <Form onSubmit={submitHandler}>
        <h3>{jobPart.jobPartTitle}</h3>
        <Form.Group controlId={jobPart.jobPartTitle.startDate}>
          <Form.Label>Start Date</Form.Label>
          <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group controlId={jobPart.jobPartTitle.dueDate}>
          <Form.Label>Due Date</Form.Label>
          <Form.Control type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Save
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Form>
    </>
  );
};

export default JobPartDueDates;
