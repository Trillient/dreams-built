import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { deleteJobPart, getJobPart, resetJobPartRedirect, updateJobPart } from '../../actions/jobActions';
import AdminGroup from '../../components/groups/AdminGroup';
import DetailsGroup from '../../components/groups/DetailsGroup';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';

import styles from './editJobPartScreen.module.css';

const EditJobPartScreen = () => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const jobPartId = params.id;

  const jobPartDetails = useSelector((state) => state.jobPart);
  const { loading, error, jobPart, redirect } = jobPartDetails;

  const [modalShow, setModalShow] = useState(false);
  const [jobPartTitle, setJobPartTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  useEffect(() => {
    if (redirect) {
      dispatch(resetJobPartRedirect());
      navigate('/jobparts');
    } else {
      if (!jobPart || jobPart._id !== jobPartId) {
        (async () => {
          try {
            const token = await getAccessTokenSilently();
            dispatch(getJobPart(token, jobPartId));
          } catch (err) {
            console.error(err);
          }
        })();
      } else {
        setJobPartTitle(jobPart.jobPartTitle);
        setJobDescription(jobPart.jobDescription);
      }
    }
  }, [jobPart, dispatch, jobPartId, redirect, getAccessTokenSilently, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(updateJobPart({ token: token, jobPartId: jobPartId, jobPart: { jobPartTitle: jobPartTitle, jobDescription: jobDescription } }));
  };

  const deleteHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(deleteJobPart(token, jobPartId));
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
          <DetailsGroup title="Job Part" link="/jobparts" linkName="Job Parts">
            <Form className={styles.form} onSubmit={submitHandler}>
              <Form.Group className={styles.part} controlId="jobPartTitle">
                <Form.Label>Job Part</Form.Label>
                <Form.Control type="text" value={jobPartTitle} placeholder="Box-up..." onChange={(e) => setJobPartTitle(e.target.value)}></Form.Control>
              </Form.Group>
              <Form.Group className={styles.description} controlId="jobPartDescription">
                <Form.Label>Job Part</Form.Label>
                <Form.Control as="textarea" value={jobDescription} placeholder="Place Shutters and..." onChange={(e) => setJobDescription(e.target.value)}></Form.Control>
              </Form.Group>
              <Button className={styles['button-update']} disabled={!jobPartTitle} type="submit" variant="success">
                Save
              </Button>
              <Button className={styles['button-delete']} onClick={setModalShow} variant="danger">
                Delete
              </Button>
            </Form>
            <DeleteConfirmationModal title={jobPartTitle} show={modalShow} setModalShow={setModalShow} onHide={() => setModalShow(false)} handleDeleteTrue={deleteHandler} />
          </DetailsGroup>
        </AdminGroup>
      )}
    </>
  );
};

export default EditJobPartScreen;
