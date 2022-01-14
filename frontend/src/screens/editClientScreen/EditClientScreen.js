import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { deleteClient, getClient, resetClientRedirect, updateClient } from '../../actions/clientActions';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const EditClientScreen = () => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const params = useParams();
  const clientId = params.id;

  const client = useSelector((state) => state.client);
  const { loading, error, clientDetails, redirect } = client;

  const [clientName, setClientName] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    if (redirect) {
      dispatch(resetClientRedirect());
      navigate('/clients');
    } else {
      if (!clientDetails || clientDetails._id !== clientId) {
        (async () => {
          try {
            const token = await getAccessTokenSilently();
            dispatch(getClient(token, clientId));
            setClientName(client.clientDetails.clientName);
            setColor(client.clientDetails.color);
          } catch (err) {
            toast.error(err);
          }
        })();
      } else {
        setClientName(client.clientDetails.clientName);
        setColor(client.clientDetails.color);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientDetails, dispatch, clientId, history, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(updateClient({ token: token, clientId: clientId, client: { clientName: clientName, color: color } }));
  };

  const deleteHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(deleteClient(token, clientId));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <ToastContainer theme="colored" />
      <Link to="/clients" className="btn btn-light my-3">
        {'<< Clients'}
      </Link>
      <h1>Edit Client</h1>
      <Button onClick={deleteHandler} variant="danger">
        Delete
      </Button>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="area">
          <Form.Label>Client</Form.Label>
          <Form.Control type="area" value={clientName} onChange={(e) => setClientName(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Label htmlFor="exampleColorInput">Color picker</Form.Label>
        <Form.Control type="color" id="exampleColorInput" value={color} onChange={(e) => setColor(e.target.value)} title="Choose your color" />
        <Button type="submit" variant="primary">
          Save
        </Button>
      </Form>
    </>
  );
};

export default EditClientScreen;
