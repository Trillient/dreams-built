import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getClient } from '../../actions/clientActions';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const EditClientScreen = ({ match }) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const clientId = match.params.id;

  const client = useSelector((state) => state.client);
  const { loading, error, clientDetails } = client;

  const [clientIdentity, setClientIdentity] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    if (!clientDetails || clientDetails._id !== clientId) {
      (async () => {
        try {
          const token = await getAccessTokenSilently();
          dispatch(getClient(token, clientId));
          setClientIdentity(client.clientDetails.clientName);
          setColor(client.clientDetails.color);
        } catch (err) {
          toast.error(err);
        }
      })();
    } else {
      setClientIdentity(client.clientDetails.clientName);
      setColor(client.clientDetails.color);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientDetails, dispatch, clientId]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <p>{clientIdentity}</p>
      {color}
    </div>
  );
};

export default EditClientScreen;
