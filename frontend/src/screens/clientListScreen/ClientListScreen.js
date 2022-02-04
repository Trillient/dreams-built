import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { ToastContainer } from 'react-toastify';
import { FiEdit } from 'react-icons/fi';

import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { getClients } from '../../actions/clientActions';

import styles from './clientListScreen.module.css';
import Paginate from '../../components/Paginate';
import Limit from '../../components/Limit';

const ClientListScreen = () => {
  const { getAccessTokenSilently } = useAuth0();

  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(1);
  console.log(limit);

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      dispatch(getClients(token, limit, currentPage));
    })();
  }, [currentPage, limit, dispatch, getAccessTokenSilently]);

  const clients = useSelector((state) => state.clients);
  const { loading, error, clientList, pages } = clients;

  return (
    <>
      <ToastContainer theme="colored" />
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <section className="container">
          <div className={styles.card}>
            <h1>Clients</h1>
            <LinkContainer to={`/clients/create`}>
              <Button className={styles.btn}>+</Button>
            </LinkContainer>
            <Table hover responsive bordered>
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>Color</th>
                  <th>Client</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th style={{ width: '5%' }}>Edit</th>
                </tr>
              </thead>
              <tbody>
                {clientList.map((client) => (
                  <tr key={client._id}>
                    <td>
                      <div className={styles.color} style={{ backgroundColor: client.color }}></div>
                    </td>
                    <td className={styles.client}>{client.clientName}</td>
                    <td>{client.contact && client.contact.name ? client.contact.name : null}</td>
                    <td>{client.contact && client.contact.email ? client.contact.email : null}</td>
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
            <Limit setLimit={setLimit} limit={limit} />
            <Paginate setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={pages} />
          </div>
        </section>
      )}
    </>
  );
};

export default ClientListScreen;
