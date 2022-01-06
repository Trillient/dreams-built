import { useAuth0 } from '@auth0/auth0-react';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const DashboardScreen = () => {
  const { isLoading, error, user } = useAuth0();

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : user['http://www.dreamsbuilt.co.nz/roles'].includes('Admin') ? (
    <Message variant="success">You're an admin</Message>
  ) : user['http://www.dreamsbuilt.co.nz/roles'].includes('Employee') ? (
    <Message variant="success">You're in the employee portal</Message>
  ) : (
    <Message variant="info">You have not been added to the employee list yet, please logout and log back in, in 24 hours</Message>
  );
};

export default DashboardScreen;
