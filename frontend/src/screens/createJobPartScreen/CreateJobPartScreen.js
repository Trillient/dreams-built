import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { createJobPart, resetJobPartRedirect } from '../../actions/jobActions';

const CreateJobPartScreen = ({ history }) => {
  const { getAccessTokenSilently } = useAuth0();

  const dispatch = useDispatch();

  const jobParts = useSelector((state) => state.jobPart);
  const { redirect } = jobParts;

  const [jobPartTitle, setJobPartTitle] = useState('');

  useEffect(() => {
    if (redirect) {
      dispatch(resetJobPartRedirect());
      history.push('/jobparts');
    }
  }, [dispatch, history, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(createJobPart({ token: token, jobPartTitle: jobPartTitle }));
  };
  return (
    <>
      <ToastContainer theme="colored" />
      <Link to="/jobparts" className="btn btn-light my-3">
        {'<< Job Parts'}
      </Link>
      <h1>Create Job Part</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="jobPart">
          <Form.Label>Job Part</Form.Label>
          <Form.Control type="jobPart" value={jobPartTitle} onChange={(e) => setJobPartTitle(e.target.value)}></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Save
        </Button>
      </Form>
    </>
  );
};

export default CreateJobPartScreen;
