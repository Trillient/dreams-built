import { useAuth0 } from '@auth0/auth0-react';

const DashboardScreen = () => {
  const { user } = useAuth0();
  console.log(user['http://www.dreamsbuilt.co.nz/roles']);
  return <div>{JSON.stringify(user)}</div>;
};

export default DashboardScreen;
