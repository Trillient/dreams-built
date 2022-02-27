import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { createJobPart, resetJobPartRedirect } from '../../actions/jobActions';

import AdminGroup from '../../components/groups/AdminGroup';
import DetailsGroup from '../../components/groups/DetailsGroup';
import Loader from '../../components/Loader';

import styles from './createJobPartScreen.module.css';

const CreateJobPartScreen = () => {
  const { getAccessTokenSilently } = useAuth0();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const jobParts = useSelector((state) => state.jobPart);
  const { redirect } = jobParts;

  const [jobPartTitle, setJobPartTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  useEffect(() => {
    if (redirect) {
      dispatch(resetJobPartRedirect());
      navigate('/jobparts');
    }
  }, [dispatch, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(createJobPart({ token: token, jobPart: { jobPartTitle: jobPartTitle, jobDescription: jobDescription } }));
  };
  return (
    <AdminGroup>
      <DetailsGroup title="Job Part" link="/jobparts" linkName="Job Parts">
        <Form className={styles.form} onSubmit={submitHandler}>
          <Form.Group className={styles.part} controlId="jobPartTitle">
            <Form.Label>Job Part</Form.Label>
            <Form.Control type="text" value={jobPartTitle} placeholder="Box-up..." onChange={(e) => setJobPartTitle(e.target.value)}></Form.Control>
          </Form.Group>
          <Form.Group className={styles.description} controlId="jobPartDescription">
            <Form.Label>Job Part</Form.Label>
            <Form.Control as="textarea" value={jobDescription} placeholder="Place Shutters and..." onChange={(e) => setJobDescription(e.target.value)}></Form.Control>
          </Form.Group>
          <Button className={styles.button} disabled={!jobPartTitle} type="submit" variant="success">
            Save
          </Button>
        </Form>
      </DetailsGroup>
    </AdminGroup>
  );
};

export default withAuthenticationRequired(CreateJobPartScreen, {
  onRedirecting: () => <Loader />,
});
