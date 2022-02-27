import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { createContractor, resetContractorRedirect } from '../../actions/contractorActions';

import AdminGroup from '../../components/groups/AdminGroup';
import DetailsGroup from '../../components/groups/DetailsGroup';
import Loader from '../../components/Loader';

import styles from './createContractorScreen.module.css';

const CreateContractorScreen = () => {
  const { getAccessTokenSilently } = useAuth0();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const contractor = useSelector((state) => state.contractor);
  const { redirect } = contractor;

  const [contractorName, setContractorName] = useState('');
  const [phone, setPhone] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  useEffect(() => {
    if (redirect) {
      dispatch(resetContractorRedirect());
      navigate('/contractors');
    }
  }, [dispatch, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(createContractor({ token: token, contractor: { contractor: contractorName, contact: contactName, email: contactEmail, phone: phone } }));
  };
  return (
    <AdminGroup>
      <DetailsGroup title="Contractor" link="/contractors" linkName="Contractors">
        <Form className={styles.form} onSubmit={submitHandler}>
          <Form.Group className={styles.contractor} controlId="contractor">
            <Form.Label>Contractor *</Form.Label>
            <Form.Control type="text" placeholder="Company..." value={contractorName} onChange={(e) => setContractorName(e.target.value)}></Form.Control>
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
            <Form.Group className="mb-2" controlId="contact.phone">
              <Form.Label>Contact Phone</Form.Label>
              <Form.Control type="text" placeholder="+64 7 555 555" value={phone} onChange={(e) => setPhone(e.target.value)}></Form.Control>
            </Form.Group>
          </div>
          <Button type="submit" className={styles.button} variant="success" disabled={!contractorName}>
            Create
          </Button>
        </Form>
      </DetailsGroup>
    </AdminGroup>
  );
};

export default withAuthenticationRequired(CreateContractorScreen, {
  onRedirecting: () => <Loader />,
});
