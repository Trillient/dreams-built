import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { ToastContainer } from 'react-toastify';
import { FiEdit } from 'react-icons/fi';
import fontColorContrast from 'font-color-contrast';

import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { getClients } from '../../actions/clientActions';

const ClientListScreen = () => {
  const { getAccessTokenSilently } = useAuth0();

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const token = await getAccessTokenSilently();
      dispatch(getClients(token));
    })();
  }, [dispatch, getAccessTokenSilently]);

  const clients = useSelector((state) => state.clients);
  const { loading, error, clientList } = clients;

  return (
    <>
      <ToastContainer theme="colored" />
      <h1>Clients</h1>
      <section>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <LinkContainer to={`/clients/create`}>
              <Button>+</Button>
            </LinkContainer>
            <Table hover responsive>
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>No.</th>
                  <th>Client</th>
                  <th style={{ width: '5%' }}>Edit</th>
                </tr>
              </thead>
              <tbody>
                {clientList.map((client, index) => (
                  <tr key={client._id}>
                    <td>{index + 1}</td>
                    <td style={{ backgroundColor: client.color, color: fontColorContrast(client.color) }}>{client.clientName}</td>
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
          </>
        )}
      </section>
    </>
  );
};

export default ClientListScreen;
