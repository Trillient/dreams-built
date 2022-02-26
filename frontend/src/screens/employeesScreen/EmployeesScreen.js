import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { ToastContainer } from 'react-toastify';

import { getEmployees } from '../../actions/employeeActions';
import HeaderSearchGroup from '../../components/groups/HeaderSearchGroup';

import PaginationGroup from '../../components/groups/PaginationGroup';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

import styles from './employeeScreen.module.css';

const EmployeesScreen = () => {
  const { getAccessTokenSilently } = useAuth0();

  const dispatch = useDispatch();

  const employees = useSelector((state) => state.employees);
  const { loading, error, employeeList, pages } = employees;

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      dispatch(getEmployees(token, limit, currentPage, search));
    })();
  }, [currentPage, dispatch, getAccessTokenSilently, limit, search]);

  if (currentPage === 0 && pages > 0) {
    setCurrentPage(1);
  }

  if (currentPage > pages) {
    if (pages === 0) {
      setCurrentPage(0);
    } else {
      setCurrentPage(1);
    }
  }

  return (
    <>
      <ToastContainer theme="colored" />
      <div className={styles.parent}>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <section className="container">
            <div className={styles.card}>
              <HeaderSearchGroup title="Employees" setSearch={setSearch} link="/employees/create" addition={false} />
              <Table hover responsive>
                <thead>
                  <tr>
                    <td className={styles.responsive}></td>
                    <td>Name</td>
                    <td className={styles.responsive}>Email</td>
                    <td>Hourly Rate</td>
                    <td className={styles.responsive}>Last login</td>
                    <td>Edit</td>
                  </tr>
                </thead>
                <tbody>
                  {employeeList.map((employee, index) => (
                    <tr key={index}>
                      <td className={styles.responsive}>
                        <img src={employee.picture} height="40" width="40" style={{ borderRadius: '50%' }} alt="" />
                      </td>
                      <td>
                        {employee.firstName} {employee.lastName}
                      </td>
                      <td className={styles.responsive}>{employee.email}</td>
                      <td>$ {employee.hourlyRate}</td>
                      <td className={styles.responsive}>{employee.last_login}</td>

                      <td>
                        <LinkContainer to={`/employees/edit/${employee._id}`}>
                          <Button className="btn-sm">
                            <FiEdit />
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <PaginationGroup pages={pages} currentPage={currentPage} setCurrentPage={setCurrentPage} limit={limit} setLimit={setLimit} />
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default withAuthenticationRequired(EmployeesScreen, {
  onRedirecting: () => <Loader />,
});
