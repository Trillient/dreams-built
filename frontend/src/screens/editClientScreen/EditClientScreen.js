import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { deleteClient, getClient, resetClientRedirect, updateClient } from '../../actions/clientActions';
import AdminGroup from '../../components/groups/AdminGroup';
import DetailsGroup from '../../components/groups/DetailsGroup';

import Loader from '../../components/Loader';
import Message from '../../components/Message';

import styles from './editClientScreen.module.css';

const EditClientScreen = () => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const params = useParams();
  const clientId = params.id;

  const client = useSelector((state) => state.client);
  const { loading, error, clientDetails, redirect } = client;

  const [clientName, setClientName] = useState('');
  const [color, setColor] = useState('#563d7c');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');

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
            setClientName(clientDetails.clientName);
            setColor(clientDetails.color);
            setContactName(clientDetails.contact && clientDetails.contact.name ? clientDetails.contact.name : '');
            setContactEmail(clientDetails.contact && clientDetails.contact.email ? clientDetails.contact.email : '');
          } catch (err) {
            console.error(err);
          }
        })();
      } else {
        setClientName(clientDetails.clientName);
        setColor(clientDetails.color);
        setContactName(clientDetails.contact && clientDetails.contact.name ? clientDetails.contact.name : '');
        setContactEmail(clientDetails.contact && clientDetails.contact.email ? clientDetails.contact.email : '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientDetails, dispatch, clientId, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(updateClient({ token: token, clientId: clientId, client: { clientName: clientName, color: color, contact: { name: contactName, email: contactEmail } } }));
  };

  const deleteHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(deleteClient(token, clientId));
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
          <DetailsGroup title="Edit Client" link="/clients" linkName="Clients">
            <Form className={styles.form} onSubmit={submitHandler}>
              <Form.Group className={styles.client} controlId="Client">
                <Form.Label>Client</Form.Label>
                <Form.Control type="text" placeholder="Company..." value={clientName} onChange={(e) => setClientName(e.target.value)}></Form.Control>
              </Form.Group>
              <Form.Group className={styles.color} controlId="color">
                <Form.Label>Colour</Form.Label>
                <Form.Control type="color" style={{ width: '100%' }} value={color} onChange={(e) => setColor(e.target.value)} title="Choose your color" />
              </Form.Group>
              <div className={styles.contact}>
                <Form.Group className="mb-2" controlId="contact.name">
                  <Form.Label>Contact Name</Form.Label>
                  <Form.Control type="text" placeholder="John Doe" value={contactName} onChange={(e) => setContactName(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group className="mb-2" controlId="contact.email">
                  <Form.Label>Contact Email</Form.Label>
                  <Form.Control type="text" placeholder="john@gmail.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}></Form.Control>
                </Form.Group>
              </div>
              <Button className={styles['button-update']} type="submit" variant="success">
                Save
              </Button>
              <Button className={styles['button-delete']} onClick={deleteHandler} variant="danger">
                Delete
              </Button>
            </Form>
          </DetailsGroup>
        </AdminGroup>
      )}
    </>
  );
};

export default withAuthenticationRequired(EditClientScreen, {
  onRedirecting: () => <Loader />,
});
