import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { getClients } from '../../actions/clientActions';
import { deleteJob, getJob, getJobDueDates, getJobPartsList, resetJobRedirect, updateJob } from '../../actions/jobActions';
import JobPartDueDates from '../../components/JobPartDueDates';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const JobDetailsScreen = ({ match, history }) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const jobId = match.params.id;

  const jobDetails = useSelector((state) => state.job);
  const { loading, error, job, redirect } = jobDetails;
  const clients = useSelector((state) => state.clients);
  const { clientList } = clients;

  const jobPartsList = useSelector((state) => state.jobParts);
  const { jobParts } = jobPartsList;

  const dueDates = useSelector((state) => state.jobDueDates);
  const { dueDateUpdated } = dueDates;

  const [display, setDisplay] = useState(false);

  const [jobNumber, setJobNumber] = useState('');
  const [client, setClient] = useState('');
  const [clientName, setClientName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [color, setColor] = useState('#00ccb4');
  const [area, setArea] = useState('');

  useEffect(() => {
    if (redirect) {
      dispatch(resetJobRedirect());
      history.push('/jobs');
    }
    if (dueDateUpdated) {
      (async () => {
        try {
          const token = await getAccessTokenSilently();
          dispatch(getJobDueDates(token, jobId));
        } catch (err) {
          console.log(err);
        }
      })();
    }
    if (!job || job._id !== jobId) {
      (async () => {
        try {
          const token = await getAccessTokenSilently();
          dispatch(getClients(token));
          dispatch(getJob(token, jobId));
          dispatch(getJobPartsList(token));
          dispatch(getJobDueDates(token, jobId));
        } catch (err) {
          console.log(err);
        }
      })();
    } else {
      if (job.client) {
        setClient(job.client._id);
        setClientName(job.client.clientName);
      }
      setJobNumber(job.jobNumber);
      setAddress(job.address);
      setCity(job.city);
      setColor(job.color);
      setArea(job.area || '');
    }
  }, [dispatch, getAccessTokenSilently, job, jobId, redirect, history, dueDateUpdated]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();

    dispatch(
      updateJob({
        token: token,
        jobId: jobId,
        job: {
          jobNumber,
          client,
          address,
          city,
          area,
          color,
        },
      })
    );
  };

  const handleDelete = async () => {
    const token = await getAccessTokenSilently();
    dispatch(deleteJob(token, jobId));
  };

  return (
    <>
      <ToastContainer theme="colored" />
      <Link to="/jobs" className="btn btn-light my-3">
        {'<< Job List'}
      </Link>

      <h1>Edit Job</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Button
            id="tbg-btn-1"
            onClick={() => {
              setDisplay(false);
            }}
          >
            Details
          </Button>
          <Button
            id="tbg-btn-2"
            onClick={() => {
              setDisplay(true);
            }}
          >
            Scheduling
          </Button>

          {!display ? (
            <>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
              <Form onSubmit={submitHandler}>
                <Form.Group controlId="jobNumber">
                  <Form.Label>Job Number</Form.Label>
                  <Form.Control type="jobNumber" placeholder="eg 22001" value={jobNumber} onChange={(e) => setJobNumber(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId="company">
                  <Form.Label>Company</Form.Label>
                  <Form.Control
                    as="select"
                    value={client}
                    onChange={(e) => {
                      setClient(e.target.value);
                      setClientName(clientList.filter((client) => client._id === e.target.value)[0].clientName);
                    }}
                  >
                    {client && <option value={client}>{clientName}</option>}
                    <option disabled>------------------------</option>
                    {clientList &&
                      clientList.map((customer) => (
                        <option key={customer._id} value={customer._id}>
                          {customer.clientName}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control type="address" placeholder="11 Sharp Place" value={address} onChange={(e) => setAddress(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId="city">
                  <Form.Label>City</Form.Label>
                  <Form.Control type="city" placeholder="Hamilton" value={city} onChange={(e) => setCity(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId="area">
                  <Form.Label>Area</Form.Label>
                  <Form.Control type="area" value={area} onChange={(e) => setArea(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Label htmlFor="exampleColorInput">Color picker</Form.Label>
                <Form.Control type="color" id="exampleColorInput" value={color} onChange={(e) => setColor(e.target.value)} title="Choose your color" />
                <Button type="submit" variant="primary">
                  Save
                </Button>
              </Form>
            </>
          ) : (
            <>
              {jobParts.map((jobPart) => (
                <JobPartDueDates key={jobPart._id} jobId={jobId} jobPart={jobPart} />
              ))}
            </>
          )}
        </>
      )}
    </>
  );
};

export default JobDetailsScreen;
