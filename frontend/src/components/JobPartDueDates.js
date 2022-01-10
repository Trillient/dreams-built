import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { createJobPartDueDate, updateJobPartDueDate } from '../actions/jobActions';

const JobPartDueDates = ({ jobPart, jobId }) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const dueDates = useSelector((state) => state.jobDueDates);
  const { jobDueDates } = dueDates;

  const jobDueDate = jobDueDates.find((dueDate) => dueDate.job === jobId && dueDate.jobPartTitle._id === jobPart._id);

  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (jobDueDate) {
      setDueDate(jobDueDate.dueDate);
    }
  }, [jobDueDate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    if (jobDueDate) {
      dispatch(updateJobPartDueDate(token, jobDueDate, dueDate));
    } else {
      dispatch(createJobPartDueDate(token, jobId, jobPart._id, dueDate));
    }
  };

  return (
    <>
      <ToastContainer theme="colored" />
      <Form onSubmit={submitHandler}>
        <Form.Group controlId={jobPart.jobPartTitle}>
          <Form.Label>{jobPart.jobPartTitle}</Form.Label>
          <Form.Control type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Save
        </Button>
        <Button variant="danger">Delete</Button>
      </Form>
    </>
  );
};

export default JobPartDueDates;
