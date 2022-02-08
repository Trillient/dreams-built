import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { ToastContainer } from 'react-toastify';
import Select from 'react-select';

import { createJob, getJobList } from '../../actions/jobActions';
import { getClients } from '../../actions/clientActions';

import AdminGroup from '../../components/groups/AdminGroup';
import DetailsGroup from '../../components/groups/DetailsGroup';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

import styles from './createJobScreen.module.css';

const CreateJobScreen = () => {
  const { getAccessTokenSilently } = useAuth0();

  const dispatch = useDispatch();

  const jobsList = useSelector((state) => state.jobsList);
  const { jobList } = jobsList;

  const clients = useSelector((state) => state.clients);
  const { loading, error, clientList } = clients;

  const [jobNumber, setJobNumber] = useState(jobList[0].jobNumber + 1 || 0);
  const [client, setClient] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState(null);
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

    dispatch(
      createJob({
        token: token,
        job: {
          jobNumber,
          client: client.value,
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
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <AdminGroup>
          <DetailsGroup title="Create Job" link="/jobs" linkName="Jobs">
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="jobNumber">
                <Form.Label>Job Number</Form.Label>
                <Form.Control type="number" placeholder="eg 22001" value={jobNumber} onChange={(e) => setJobNumber(e.target.value)}></Form.Control>
              </Form.Group>
              <Form.Group controlId="company">
                <Form.Label>Company</Form.Label>
                <Select
                  menuPosition={'fixed'}
                  isClearable="true"
                  placeholder="Select Company..."
                  defaultValue={client}
                  onChange={setClient}
                  options={
                    clientList &&
                    clientList.map((option) => {
                      return { label: `${option.clientName}`, value: option._id };
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" placeholder="11 Sharp Place" value={address} onChange={(e) => setAddress(e.target.value)}></Form.Control>
              </Form.Group>
              <Form.Group controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" placeholder="Hamilton" value={city} onChange={(e) => setCity(e.target.value)}></Form.Control>
              </Form.Group>
              <Form.Group controlId="area">
                <Form.Label>Area</Form.Label>
                <Form.Control type="number" placeholder="100.0" value={area} onChange={(e) => setArea(e.target.value)}></Form.Control>
              </Form.Group>
              <Form.Label htmlFor="exampleColorInput">Color picker</Form.Label>
              <Form.Control type="color" id="exampleColorInput" defaultValue="#563d7c" onChange={(e) => setColor(e.target.value)} title="Choose your color" />
              <Button type="submit" variant="success" disabled={!jobNumber}>
                Save
              </Button>
            </Form>
          </DetailsGroup>
        </AdminGroup>
      )}
    </>
  );
};

export default withAuthenticationRequired(CreateJobScreen, {
  onRedirecting: () => <Loader />,
});
