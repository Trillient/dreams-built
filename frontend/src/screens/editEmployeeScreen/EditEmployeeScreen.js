import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { addRole, deleteRole, deleteUser, getUser, resetUserRedirect, updateUser } from '../../actions/employeeActions';
import AdminGroup from '../../components/groups/AdminGroup';
import DetailsGroup from '../../components/groups/DetailsGroup';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';

import styles from './editEmployeeScreen.module.css';

const EditEmployeeScreen = () => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const userId = params.id;

  const employee = useSelector((state) => state.employee);
  const { loading, error, user, redirect, roles } = employee;

  const [modalShow, setModalShow] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);

  useEffect(() => {
    if (redirect) {
      dispatch(resetUserRedirect());
      navigate('/employees');
    } else {
      if (!user || user._id !== userId) {
        (async () => {
          try {
            const token = await getAccessTokenSilently();
            dispatch(getUser(token, userId));
          } catch (err) {
            console.error(err);
          }
        })();
      } else {
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setHourlyRate(user.hourlyRate || '');
        setIsAdmin(roles && roles.filter(({ name }) => name === 'Admin').length > 0);
        setIsEmployee(roles && roles.filter(({ name }) => name === 'Employee').length > 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, roles, dispatch, userId, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(updateUser({ token: token, userId: userId, user: { firstName, lastName, hourlyRate } }));
  };

  const deleteHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(deleteUser(token, userId));
    setModalShow(false);
  };

  const handleRoleChange = async (method, role) => {
    const token = await getAccessTokenSilently();
    method === 'assign' ? dispatch(addRole(token, userId, role)) : dispatch(deleteRole(token, userId, role));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <ToastContainer theme="colored" />
      {loading ? (
        <Loader />
      ) : error && error.length < 1 ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <AdminGroup>
          <DetailsGroup title="Edit Employee" link="/employees" linkName="Employees">
            <Form className={styles.form} onSubmit={submitHandler}>
              <Form.Group className={styles.fname} controlId="firstName">
                <Form.Label>First Name:</Form.Label>
                <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}></Form.Control>
              </Form.Group>

              <Form.Group className={styles.lname} controlId="lastName">
                <Form.Label>Last Name:</Form.Label>
                <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}></Form.Control>
              </Form.Group>

              <Form.Group className={styles.rate} controlId="hourlyRate">
                <Form.Label>Hourly Rate</Form.Label>
                <Form.Control type="Number" value={hourlyRate} min="0" onChange={(e) => setHourlyRate(e.target.value)} />
              </Form.Group>

              <Button className={styles['button-update']} disabled={!firstName} type="submit" variant="success">
                Save
              </Button>
              <Button className={styles['button-delete']} onClick={setModalShow} variant="danger">
                Delete
              </Button>
            </Form>

            <div className={styles.roles}>
              <h3 className={styles['roles-title']}>Roles</h3>
              {!isAdmin ? (
                <div className={styles.admin}>
                  <h4>Not Admin</h4>
                  <Button
                    onClick={() => {
                      handleRoleChange('assign', 'admin');
                    }}
                    variant="warning"
                  >
                    Give Admin Privleges
                  </Button>
                </div>
              ) : (
                <div className={styles.admin}>
                  <h4>Admin</h4>
                  <Button
                    onClick={() => {
                      handleRoleChange('remove', 'admin');
                    }}
                    variant="danger"
                  >
                    Remove Admin Privileges
                  </Button>
                </div>
              )}

              {!isEmployee ? (
                <div className={styles.employee}>
                  <h4>Not an Employee</h4>
                  <Button
                    onClick={() => {
                      handleRoleChange('assign', 'employee');
                    }}
                    variant="warning"
                  >
                    Give Employee Privleges
                  </Button>
                </div>
              ) : (
                <div className={styles.employee}>
                  <h4>Employee</h4>
                  <Button
                    onClick={() => {
                      handleRoleChange('remove', 'employee');
                    }}
                    variant="danger"
                  >
                    Remove Employee Privileges
                  </Button>
                </div>
              )}
            </div>
            <DeleteConfirmationModal title={`${firstName} ${lastName}`} show={modalShow} setModalShow={setModalShow} onHide={() => setModalShow(false)} handleDeleteTrue={deleteHandler} />
          </DetailsGroup>
        </AdminGroup>
      )}
    </>
  );
};

export default withAuthenticationRequired(EditEmployeeScreen, {
  onRedirecting: () => <Loader />,
});
