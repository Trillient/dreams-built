import { useAuth0 } from '@auth0/auth0-react';
import Loader from '../Loader';
import Message from '../Message';

const AdminGroup = ({ children }) => {
  const { isLoading, error, user } = useAuth0();
  const domain = process.env.REACT_APP_CUSTOM_DOMAIN;
  return isLoading ? (
    <Loader />
  ) : error ? (
    <div className="container mt-3">
      <Message variant="danger">{error}</Message>
    </div>
  ) : user[`${domain}/roles`].includes('Admin') ? (
    children
  ) : (
    <div className="container mt-3">
      <Message variant="danger">You do not have permission to view this page</Message>
    </div>
  );
};

export default AdminGroup;
