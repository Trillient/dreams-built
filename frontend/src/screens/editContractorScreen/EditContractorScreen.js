import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { deleteContractor, getContractor, resetContractorRedirect, updateContractor } from '../../actions/contractorActions';

import AdminGroup from '../../components/groups/AdminGroup';
import DetailsGroup from '../../components/groups/DetailsGroup';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';

import styles from './editContractorScreen.module.css';

const EditContractorScreen = () => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const params = useParams();
  const contractorId = params.id;

  const contractor = useSelector((state) => state.contractor);
  const { loading, error, contractorDetails, redirect } = contractor;

  const [modalShow, setModalShow] = useState(false);
  const [contractorName, setContractorName] = useState('');
  const [phone, setPhone] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  useEffect(() => {
    if (redirect) {
      dispatch(resetContractorRedirect());
      navigate('/contractors');
    } else {
      if (!contractorDetails || contractorDetails._id !== contractorId) {
        (async () => {
          try {
            const token = await getAccessTokenSilently();
            dispatch(getContractor(token, contractorId));
          } catch (err) {
            console.error(err);
          }
        })();
      } else {
        setContractorName(contractorDetails.contractor ? contractorDetails.contractor : '');
        setPhone(contractorDetails.phone ? contractorDetails.phone : '');
        setContactName(contractorDetails.name ? contractorDetails.contact.name : '');
        setContactEmail(contractorDetails.email ? contractorDetails.email : '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractorDetails, dispatch, contractorId, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(updateContractor({ token: token, contractorId: contractorId, contractor: { contractor: contractorName, contact: contactName, email: contactEmail, phone: phone } }));
  };

  const handleDeleteTrue = async () => {
    const token = await getAccessTokenSilently();
    dispatch(deleteContractor(token, contractorId));
    setModalShow(false);
  };

  return (
    <>
      <ToastContainer theme="colored" />
      {loading ? (
        <Loader />
      ) : error && error.length < 1 ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <AdminGroup>
          <DetailsGroup title="Contractor" link="/contractors" linkName="Contractors">
            <Form className={styles.form} onSubmit={submitHandler}>
              <Form.Group className={styles.contractor} controlId="contractor">
                <Form.Label>Contractor</Form.Label>
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
              <Button className={styles['button-update']} disabled={!contractorName} type="submit" variant="success">
                Save
              </Button>
              <Button className={styles['button-delete']} onClick={setModalShow} variant="danger">
                Delete
              </Button>
            </Form>
            <DeleteConfirmationModal title={contractorName} show={modalShow} setModalShow={setModalShow} onHide={() => setModalShow(false)} handleDeleteTrue={handleDeleteTrue} />
          </DetailsGroup>
        </AdminGroup>
      )}
    </>
  );
};

export default withAuthenticationRequired(EditContractorScreen, {
  onRedirecting: () => <Loader />,
});
