import { useEffect, useState } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { ToastContainer } from 'react-toastify';
import { FiEdit } from 'react-icons/fi';

import { getContractors } from '../../actions/contractorActions';

import HeaderSearchGroup from '../../components/groups/HeaderSearchGroup';
import PaginationGroup from '../../components/groups/PaginationGroup';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

import styles from './contractorListScreen.module.css';

const ContractorListScreen = () => {
  const { getAccessTokenSilently } = useAuth0();

  const dispatch = useDispatch();

  const contractors = useSelector((state) => state.contractors);
  const { loading, error, contractorList, pages } = contractors;

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      dispatch(getContractors(token, limit, currentPage, search));
    })();
  }, [currentPage, limit, search, dispatch, getAccessTokenSilently]);

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
              <HeaderSearchGroup title="Contractors" setSearch={setSearch} link="/contractors/create" />
              <Table hover responsive="sm" bordered>
                <thead>
                  <tr>
                    <th>Contractor</th>
                    <th className={styles.responsive}>Contact</th>
                    <th className={styles.responsive}>Email</th>
                    <th className={styles.responsive}>Phone</th>
                    <th style={{ width: '5%' }}>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {contractorList.map((contractor) => (
                    <tr key={contractor._id} className={styles.data}>
                      <td>{contractor.contractor}</td>
                      <td className={styles.responsive}>{contractor.contact}</td>
                      <td className={styles.responsive}>{contractor.email}</td>
                      <td className={styles.responsive}>{contractor.phone}</td>
                      <td>
                        <LinkContainer to={`/contractors/edit/${contractor._id}`}>
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

export default withAuthenticationRequired(ContractorListScreen, {
  onRedirecting: () => <Loader />,
});
