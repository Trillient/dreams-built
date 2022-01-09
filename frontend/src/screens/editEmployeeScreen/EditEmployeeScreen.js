import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { deleteUser, getUser, resetUserRedirect, updateUser } from '../../actions/employeeActions';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const EditEmployeeScreen = ({ match, history }) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const userId = match.params.id;

  const employee = useSelector((state) => state.employee);
  const { loading, error, user, redirect } = employee;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [birthDate, setBirthDate] = useState('');

  useEffect(() => {
    if (redirect) {
      dispatch(resetUserRedirect());
      history.push('/employees');
    } else {
      if (!user || user._id !== userId) {
        (async () => {
          try {
            const token = await getAccessTokenSilently();
            dispatch(getUser(token, userId));
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setHourlyRate(user.hourlyRate);
            setBirthDate(user.birthDate);
          } catch (err) {
            toast.error(err);
          }
        })();
      } else {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setHourlyRate(user.hourlyRate);
        setBirthDate(user.birthDate);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, dispatch, userId, history, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(updateUser({ token: token, userId: userId, user: { firstName, lastName, hourlyRate, birthDate } }));
  };

  const deleteHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(deleteUser(token, userId));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <ToastContainer theme="colored" />
      <Link to="/employees" className="btn btn-light my-3">
        {'<< Employees'}
      </Link>
      <h1>Edit</h1>
      <Button onClick={deleteHandler} variant="danger">
        Delete
      </Button>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="firstName">
          <Form.Label>First Name:</Form.Label>
          <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group controlId="lastName">
          <Form.Label>Last Name:</Form.Label>
          <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group controlId="area">
          <Form.Label>Hourly Rate</Form.Label>
          <Form.Control type="Number" value={hourlyRate} min="0" onChange={(e) => setHourlyRate(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group controlId="area">
          <Form.Label>Birthdate:</Form.Label>
          <Form.Control type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Save
        </Button>
      </Form>
    </>
  );
};

export default EditEmployeeScreen;
