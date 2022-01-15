import { useAuth0 } from '@auth0/auth0-react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import InfoBlock from '../../components/InfoBlock';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import styles from './dashboardScreen.module.css';

const DashboardScreen = () => {
  const { isLoading, error, user } = useAuth0();

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : user['http://www.dreamsbuilt.co.nz/roles'].includes('Admin') ? (
    <>
      <Message variant="success">You're an admin</Message>
      <div className={styles.grid}>
        <InfoBlock
          icon={<HiOutlineInformationCircle />}
          iconText="Help Center"
          title="Need help figuring things out?"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          link={{ title: 'Help Center', link: '/help' }}
        />
        <InfoBlock
          icon={<HiOutlineInformationCircle />}
          iconText="Help Center"
          title="Need help figuring things out?"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          link={{ title: 'Help Center', link: '/help' }}
        />
        <InfoBlock
          icon={<HiOutlineInformationCircle />}
          iconText="Help Center"
          title="Need help figuring things out?"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          link={{ title: 'Help Center', link: '/help' }}
        />
        <InfoBlock
          icon={<HiOutlineInformationCircle />}
          iconText="Help Center"
          title="Need help figuring things out?"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          link={{ title: 'Help Center', link: '/help' }}
        />
      </div>
    </>
  ) : user['http://www.dreamsbuilt.co.nz/roles'].includes('Employee') ? (
    <Message variant="success">You're in the employee portal</Message>
  ) : (
    <Message variant="info">You have not been added to the employee list yet, please logout and log back in, in 24 hours</Message>
  );
};

export default DashboardScreen;
