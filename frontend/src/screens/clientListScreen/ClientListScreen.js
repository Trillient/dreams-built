import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { ToastContainer } from 'react-toastify';
import { FiEdit } from 'react-icons/fi';

import Loader from '../../components/Loader';
import Message from '../../components/Message';
import Paginate from '../../components/Paginate';
import Limit from '../../components/Limit';
import SearchBox from '../../components/SearchBox';

import { getClients } from '../../actions/clientActions';

import styles from './clientListScreen.module.css';

const ClientListScreen = () => {
  const { getAccessTokenSilently } = useAuth0();

  const dispatch = useDispatch();

  const clients = useSelector((state) => state.clients);
  const { loading, error, clientList, pages } = clients;

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      dispatch(getClients(token, limit, currentPage, search));
    })();
  }, [currentPage, limit, search, dispatch, getAccessTokenSilently]);
  if (currentPage > pages) {
    setCurrentPage(1);
  }
  return (
    <div className={styles.parent}>
      <ToastContainer theme="colored" />
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <section className="container">
          <div className={styles.card}>
            <div className={styles.header}>
              <h1 className={styles.title}>Clients</h1>
              <div className={styles.add}>
                <LinkContainer to={`/clients/create`}>
                  <Button className={styles.btn}>+</Button>
                </LinkContainer>
              </div>
              <div className={styles.search}>
                <SearchBox setSearch={setSearch} />
              </div>
            </div>
            <Table hover responsive="sm" bordered>
              <thead>
                <tr>
                  <th className={styles.responsive} style={{ width: '5%' }}>
                    Colour
                  </th>
                  <th>Client</th>
                  <th className={styles.responsive}>Contact</th>
                  <th className={styles.responsive}>Email</th>
                  <th style={{ width: '5%' }}>Edit</th>
                </tr>
              </thead>
              <tbody>
                {clientList.map((client) => (
                  <tr key={client._id} className={styles.data}>
                    <td className={styles.responsive}>
                      <div className={styles.color} style={{ backgroundColor: client.color }}></div>
                    </td>
                    <td className={styles.client}>{client.clientName}</td>
                    <td className={styles.responsive}>{client.contact && client.contact.name ? client.contact.name : null}</td>
                    <td className={styles.responsive}>{client.contact && client.contact.email ? client.contact.email : null}</td>
                    <td>
                      <LinkContainer to={`/clients/edit/${client._id}`}>
                        <Button className="btn-sm">
                          <FiEdit />
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {pages > 1 && (
              <div className={styles.controls}>
                <div>
                  <Paginate setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={pages} />
                </div>
                <div className={styles.limit}>
                  <Limit setLimit={setLimit} limit={limit} />
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default ClientListScreen;
