import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { deleteJobPart, getJobPart, resetJobPartRedirect, updateJobPart } from '../../actions/jobActions';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const EditJobPartScreen = () => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const jobPartId = params.id;

  const jobPartDetails = useSelector((state) => state.jobPart);
  const { loading, error, jobPart, redirect } = jobPartDetails;

  const [jobPartTitle, setJobPartTitle] = useState('');

  useEffect(() => {
    if (redirect) {
      dispatch(resetJobPartRedirect());
      navigate('/jobparts');
    } else {
      if (!jobPart || jobPart._id !== jobPartId) {
        (async () => {
          try {
            const token = await getAccessTokenSilently();
            dispatch(getJobPart(token, jobPartId));
            setJobPartTitle(jobPart.jobPartTitle);
          } catch (err) {
            toast.error(err);
          }
        })();
      } else {
        setJobPartTitle(jobPart.jobPartTitle);
      }
    }
  }, [jobPart, dispatch, jobPartId, history, redirect, getAccessTokenSilently]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(updateJobPart({ token: token, jobPartId: jobPartId, jobPart: { jobPartTitle: jobPartTitle } }));
  };

  const deleteHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(deleteJobPart(token, jobPartId));
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <ToastContainer theme="colored" />
      <Link to="/jobparts" className="btn btn-light my-3">
        {'<< Job Part List'}
      </Link>
      <h1>Edit Job Part</h1>
      <Button onClick={deleteHandler} variant="danger">
        Delete
      </Button>
      {error && <Message variant="danger">{error}</Message>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="jobPartTitle">
          <Form.Label>Job Part</Form.Label>
          <Form.Control type="jobPartTitle" value={jobPartTitle} onChange={(e) => setJobPartTitle(e.target.value)}></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Save
        </Button>
      </Form>
    </>
  );
};

export default EditJobPartScreen;
