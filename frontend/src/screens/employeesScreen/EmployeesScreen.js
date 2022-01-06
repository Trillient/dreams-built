import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { ToastContainer } from 'react-toastify';
import { getEmployees } from '../../actions/employeeActions';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const EmployeesScreen = () => {
  const { getAccessTokenSilently } = useAuth0();

  const dispatch = useDispatch();

  useEffect(() => {
    let token;
    const getToken = async () => {
      token = await getAccessTokenSilently();
    };
    getToken().then(() => dispatch(getEmployees(token)));
  }, [dispatch, getAccessTokenSilently]);

  const employees = useSelector((state) => state.employees);
  const { loading, error, employeeList } = employees;

  return (
    <>
      <ToastContainer theme="colored" />
      <h1>Employees</h1>
      <section>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Table hover responsive>
            <thead>
              <tr>
                <td>pic</td>
                <td>Name</td>
                <td>Email</td>
                <td>Hourly Rate</td>
                <td>Last login</td>
                <td>Edit</td>
              </tr>
            </thead>
            <tbody>
              {employeeList.map((employee) => (
                <tr key={employee._id}>
                  <td>
                    <img src={employee.picture} height="40" width="40" style={{ borderRadius: '50%' }} alt="" />
                  </td>
                  <td>
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td>{employee.email}</td>
                  <td>$ {employee.hourlyRate}</td>
                  <td>{employee.last_login}</td>

                  <td>
                    <LinkContainer to={`/employees/${employee._id}`}>
                      <Button className="btn-sm">
                        <FiEdit />
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>
      <div>Pagination</div>
    </>
  );
};

export default EmployeesScreen;
