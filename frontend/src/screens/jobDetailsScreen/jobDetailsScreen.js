import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Select from 'react-select';

import { getClients } from '../../actions/clientActions';
import { deleteJob, getJob, getJobDueDates, getJobPartsList, resetJobRedirect, updateJob } from '../../actions/jobActions';

import AdminGroup from '../../components/groups/AdminGroup';
import DetailsGroup from '../../components/groups/DetailsGroup';
import JobPartDueDates from '../../components/JobPartDueDates';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

import styles from './jobDetailsScreen.module.css';

const JobDetailsScreen = () => {
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#ddd' : client || !clientError ? '#ddd' : 'red',
      '&:hover': {
        borderColor: state.isFocused ? '#ddd' : client || !clientError ? '#ddd' : 'red',
      },
    }),
  };
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const jobId = params.id;

  const jobDetails = useSelector((state) => state.job);
  const { loading, error, job, redirect } = jobDetails;
  const clients = useSelector((state) => state.clients);
  const { clientList } = clients;

  const jobPartsList = useSelector((state) => state.jobParts);
  const { jobParts } = jobPartsList;

  const dueDates = useSelector((state) => state.jobDueDates);
  const { dueDateUpdated } = dueDates;

  const [display, setDisplay] = useState(0);

  const [jobNumberError, setJobNumberError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [clientError, setClientError] = useState(false);

  const [jobNumber, setJobNumber] = useState('');
  const [client, setClient] = useState('');
  const [endClient, setEndClient] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [color, setColor] = useState('#00ccb4');
  const [area, setArea] = useState('');
  const [invoiced, setInvoiced] = useState(false);

  const defaultLabel = job && job.client ? { label: `${job.client.clientName}` } : '';

  useEffect(() => {
    if (redirect) {
      dispatch(resetJobRedirect());
      navigate('/jobs');
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
      setClient({ value: job.client._id } || '');
      setJobNumber(job.jobNumber || '');
      setAddress(job.address || '');
      setCity(job.city || '');
      setColor(job.color || '');
      setArea(job.area || '');
      setEndClient(job.endClient || '');
      setInvoiced(job.isInvoiced || false);
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
  }, [dispatch, navigate, getAccessTokenSilently, job, jobId, redirect, dueDateUpdated]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    if (!jobNumber || parseInt(jobNumber) < 0) {
      setJobNumberError(true);
    } else {
      setJobNumberError(false);
    }

    if (!address) {
      setAddressError(true);
    } else {
      setAddressError(false);
    }

    if (!client) {
      setClient('');
      setClientError(true);
    } else {
      setClientError(false);
    }

    dispatch(
      updateJob({
        token: token,
        jobId: jobId,
        job: {
          jobNumber: jobNumber,
          client: client && client.value ? client.value : '',
          address: address,
          city: city,
          area: area,
          color: color,
          endClient: endClient,
          isInvoiced: invoiced,
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
      {loading ? (
        <Loader />
      ) : error && error.length < 1 ? (
        <Message variant="danger">'test'</Message>
      ) : (
        <AdminGroup>
          <DetailsGroup title="Edit Job" link="/jobs" linkName="Jobs">
            <ButtonGroup aria-label="Basic example" style={{ display: 'block', textAlign: 'center', margin: '1rem' }}>
              <Button onClick={() => setDisplay(0)} variant={display === 0 ? 'success' : 'primary'}>
                Job Details
              </Button>
              <Button onClick={() => setDisplay(1)} variant={display === 1 ? 'success' : 'primary'}>
                Scheduling
              </Button>
            </ButtonGroup>

            {display === 0 && (
              <Form className={styles.form} onSubmit={submitHandler}>
                <Form.Group className={styles.job} controlId="jobNumber">
                  <Form.Label>Job Number *</Form.Label>
                  <Form.Control isInvalid={jobNumberError} type="number" placeholder="eg 22001" value={jobNumber} onChange={(e) => setJobNumber(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group className={styles.color} controlId="color">
                  <Form.Label>Colour *</Form.Label>
                  <Form.Control style={{ width: '100%' }} type="color" defaultValue="#563d7c" onChange={(e) => setColor(e.target.value)} title="Choose your color" />
                </Form.Group>
                <Form.Group className={styles.client} controlId="company">
                  <Form.Label>Client *</Form.Label>
                  <Select
                    styles={customStyles}
                    menuPosition={'fixed'}
                    isClearable="true"
                    placeholder="Select Company..."
                    defaultValue={defaultLabel}
                    onChange={setClient}
                    options={
                      clientList &&
                      clientList.map((option) => {
                        return { label: `${option.clientName}`, value: option._id };
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className={styles.address} controlId="address">
                  <Form.Label>Address *</Form.Label>
                  <Form.Control isInvalid={addressError} type="text" placeholder="11 Sharp Place" value={address} onChange={(e) => setAddress(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group className={styles.city} controlId="city">
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" placeholder="Hamilton" value={city} onChange={(e) => setCity(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group className={styles.area} controlId="area">
                  <Form.Label>Area</Form.Label>
                  <Form.Control type="number" placeholder="100.0" value={area} onChange={(e) => setArea(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group className={styles.customer} controlId="city">
                  <Form.Label>Customer</Form.Label>
                  <Form.Control type="text" placeholder="John Doe" value={endClient} onChange={(e) => setEndClient(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group className={styles.invoiced} controlId="city">
                  <Form.Check type={'checkbox'} label={'Invoiced'} defaultChecked={invoiced} onChange={() => setInvoiced(!invoiced)} />
                </Form.Group>
                <Button type="submit" className={styles.button} variant="success" disabled={!jobNumber}>
                  Save
                </Button>
                <Button variant="danger" className={styles.delete} onClick={handleDelete}>
                  Delete
                </Button>
              </Form>
            )}
            {display === 1 && (
              <>
                {jobParts.map((jobPart) => (
                  <JobPartDueDates key={jobPart._id} jobId={jobId} jobPart={jobPart} />
                ))}
              </>
            )}
          </DetailsGroup>
        </AdminGroup>
      )}
    </>
  );
};

export default withAuthenticationRequired(JobDetailsScreen, {
  onRedirecting: () => <Loader />,
});
