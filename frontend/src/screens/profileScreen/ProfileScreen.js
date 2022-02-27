import { useEffect, useState } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { getProfile, updateProfile } from '../../actions/employeeActions';

import Message from '../../components/Message';
import Loader from '../../components/Loader';

import styles from './profileScreen.module.css';

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  const dispatch = useDispatch();

  const userProfile = useSelector((state) => state.profile);
  const { loading, error, userData } = userProfile;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if (!userData) {
      (async () => {
        try {
          const token = await getAccessTokenSilently();
          dispatch(getProfile(token, user.sub));
        } catch (err) {
          console.error(err);
        }
      })();
    } else {
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
    }
  }, [userData, dispatch, user.sub, getAccessTokenSilently]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    const updatedUser = {
      firstName: firstName,
      lastName: lastName,
    };

    dispatch(updateProfile(token, updatedUser, user.sub));
  };

  return isLoading || loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    isAuthenticated && (
      <div className="container">
        <Form className={styles.form} onSubmit={submitHandler}>
          <img className={styles.img} src={user.picture} alt={user.name} />
          <Form.Group className={styles.email} controlId="email">
            <Form.Label>Email - (contact admin to change)</Form.Label>
            <Form.Control type="text" defaultValue={user.email} disabled></Form.Control>
          </Form.Group>
          <Form.Group className={styles.fname} controlId="firstName">
            <Form.Label>First Name:</Form.Label>
            <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}></Form.Control>
          </Form.Group>
          <Form.Group className={styles.lname} controlId="lastName">
            <Form.Label>Last Name:</Form.Label>
            <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}></Form.Control>
          </Form.Group>
          <Button className={styles['button-update']} disabled={!firstName} type="submit" variant="success">
            Save
          </Button>
        </Form>
      </div>
    )
  );
};

export default withAuthenticationRequired(Profile, {
  onRedirecting: () => <Loader />,
});
