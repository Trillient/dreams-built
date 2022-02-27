import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import Select from 'react-select';

import { createJob, getJobList } from '../../actions/jobActions';
import { getClients } from '../../actions/clientActions';

import AdminGroup from '../../components/groups/AdminGroup';
import DetailsGroup from '../../components/groups/DetailsGroup';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

import styles from './createJobScreen.module.css';

const CreateJobScreen = () => {
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

  const jobsList = useSelector((state) => state.jobsList);
  const { jobList } = jobsList;

  const clients = useSelector((state) => state.clients);
  const { loading, error, clientList } = clients;

  const [jobNumberError, setJobNumberError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [clientError, setClientError] = useState(false);

  const [jobNumber, setJobNumber] = useState((jobList[0] && jobList[0].jobNumber + 1) || '');
  const [client, setClient] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [endClient, setEndClient] = useState('');
  const [color, setColor] = useState('#563d7c');

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      dispatch(getJobList(token));
      dispatch(getClients(token));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      createJob({
        token: token,
        job: {
          jobNumber: jobNumber,
          client: client?.value,
          address: address,
          city: city,
          area: area,
          color: color,
          endClient: endClient,
        },
      })
    );
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <AdminGroup>
      <DetailsGroup title="Create Job" link="/jobs" linkName="Jobs">
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
              defaultValue={client}
              onChange={setClient}
              options={
                clientList &&
                clientList.map((option) => {
                  return { label: option.clientName, value: option._id };
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
          <Button type="submit" className={styles.button} variant="success" disabled={!jobNumber}>
            Save
          </Button>
        </Form>
      </DetailsGroup>
    </AdminGroup>
  );
};

export default withAuthenticationRequired(CreateJobScreen, {
  onRedirecting: () => <Loader />,
});
