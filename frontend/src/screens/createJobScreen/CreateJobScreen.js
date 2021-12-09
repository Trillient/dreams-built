import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { ToastContainer } from 'react-toastify';

import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { getClients, createJob } from '../../actions/jobActions';

// import styles from './createJobScreen.module.css';

const CreateJobScreen = () => {
  const [jobNumber, setJobNumber] = useState('');
  const [client, setClient] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [color, setColor] = useState('#563d7c');

  const { getAccessTokenSilently } = useAuth0();

  const dispatch = useDispatch();

  useEffect(() => {
    let token;
    const getToken = async () => {
      token = await getAccessTokenSilently();
    };
    getToken().then(() => dispatch(getClients(token)));
  }, []);

  const clients = useSelector((state) => state.clients);
  const { loading, error, clientList } = clients;

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();

    dispatch(
      createJob({
        token: token,
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

  return (
    <>
      <ToastContainer theme="colored" />
      <Link to="/jobslist" className="btn btn-light my-3">
        Go Back
      </Link>

      <h1>Create Job</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="jobNumber">
            <Form.Label>Job Number</Form.Label>
            <Form.Control type="jobNumber" placeholder="eg 22001" value={jobNumber} onChange={(e) => setJobNumber(e.target.value)}></Form.Control>
          </Form.Group>
          <Form.Group controlId="company">
            <Form.Label>Company</Form.Label>
            <Form.Control as="select" value={client} onChange={(e) => setClient(e.target.value)}>
              {clientList.map((customer) => (
                <option value={customer._id}>{customer.clientName}</option>
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
            <Form.Control type="area" placeholder="" value={area} onChange={(e) => setArea(e.target.value)}></Form.Control>
          </Form.Group>
          {/* TODO - add color to each job */}
          <Form.Label htmlFor="exampleColorInput">Color picker</Form.Label>
          <Form.Control type="color" id="exampleColorInput" defaultValue="#563d7c" onChange={(e) => setColor(e.target.value)} title="Choose your color" />
          <Button type="submit" variant="primary">
            Save
          </Button>
        </Form>
      )}
    </>
  );
};

export default CreateJobScreen;
