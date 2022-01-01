import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { ToastContainer } from 'react-toastify';

import { createClient } from '../../actions/clientActions';

const CreateClientScreen = () => {
  const { getAccessTokenSilently } = useAuth0();

  const dispatch = useDispatch();

  const [clientName, setClientName] = useState('');
  const [color, setColor] = useState('#563d7c');

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(createClient({ token: token, client: { clientName, color } }));
  };
  return (
    <>
      <ToastContainer theme="colored" />
      <Link to="/clients" className="btn btn-light my-3">
        {'<< Clients'}
      </Link>
      <h1>Create Client</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="area">
          <Form.Label>Client</Form.Label>
          <Form.Control type="area" placeholder="" value={clientName} onChange={(e) => setClientName(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Label htmlFor="exampleColorInput">Color picker</Form.Label>
        <Form.Control type="color" id="exampleColorInput" defaultValue="#563d7c" onChange={(e) => setColor(e.target.value)} title="Choose your color" />
        <Button type="submit" variant="primary">
          Save
        </Button>
      </Form>
    </>
  );
};

export default CreateClientScreen;
