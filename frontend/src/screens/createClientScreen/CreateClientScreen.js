import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { ToastContainer } from 'react-toastify';

import { createClient, resetClientRedirect } from '../../actions/clientActions';

import Loader from '../../components/Loader';
import DetailsGroup from '../../components/groups/DetailsGroup';
import AdminGroup from '../../components/groups/AdminGroup';

import styles from './createClientScreen.module.css';

const CreateClientScreen = () => {
  const { getAccessTokenSilently } = useAuth0();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const client = useSelector((state) => state.client);
  const { redirect } = client;

  const [clientName, setClientName] = useState('');
  const [color, setColor] = useState('#563d7c');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  useEffect(() => {
    if (redirect) {
      dispatch(resetClientRedirect());
      navigate('/clients');
    }
  }, [dispatch, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(createClient({ token: token, client: { clientName: clientName, color: color, contact: { name: contactName, email: contactEmail } } }));
  };
  return (
    <>
      <ToastContainer theme="colored" />
      <AdminGroup>
        <DetailsGroup title="Create Client" link="/clients" linkName="Clients">
          <Form className={styles.form} onSubmit={submitHandler}>
            <Form.Group className={styles.client} controlId="Client">
              <Form.Label>Client</Form.Label>
              <Form.Control type="text" placeholder="Company..." value={clientName} onChange={(e) => setClientName(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group className={styles.color} controlId="color">
              <Form.Label htmlFor="ColorInput">Colour</Form.Label>
              <Form.Control type="color" style={{ width: '100%' }} id="ColorInput" value={color} onChange={(e) => setColor(e.target.value)} title="Choose your color" />
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
            <Button type="submit" className={styles.button} variant="success" disabled={!clientName}>
              Create
            </Button>
          </Form>
        </DetailsGroup>
      </AdminGroup>
    </>
  );
};

export default withAuthenticationRequired(CreateClientScreen, {
  onRedirecting: () => <Loader />,
});
