import { useAuth0 } from '@auth0/auth0-react';
import { HiOutlineInformationCircle } from 'react-icons/hi';

import InfoBlock from '../../components/InfoBlock';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import styles from './dashboardScreen.module.css';

const DashboardScreen = () => {
  const { isLoading, error, user } = useAuth0();
  const domain = process.env.REACT_APP_CUSTOM_DOMAIN;
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : user[`${domain}/roles`].includes('Admin') ? (
    <div className="parent-container">
      <Message margin={'0'} variant="success">
        You're an admin
      </Message>
      <div className={styles.grid}>
        <InfoBlock
          icon={<HiOutlineInformationCircle />}
          iconText="Video Tutorial"
          title="Need help figuring things out?"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          link={{ title: 'Help Center', link: '/help' }}
        />
        <InfoBlock
          icon={<HiOutlineInformationCircle />}
          iconText="Schedule"
          title="Need help figuring things out?"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          link={{ title: 'Help Center', link: '/help' }}
        />
        <InfoBlock
          icon={<HiOutlineInformationCircle />}
          iconText="Job Reports"
          title="Need help figuring things out?"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          link={{ title: 'Help Center', link: '/help' }}
        />
        <InfoBlock
          icon={<HiOutlineInformationCircle />}
          iconText="Job List"
          title="Need help figuring things out?"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          link={{ title: 'Help Center', link: '/help' }}
        />
      </div>
    </div>
  ) : user[`${domain}/roles`].includes('Employee') ? (
    <div className="parent-container">
      <Message margin={'0'} variant="success">
        You're in the employee portal
      </Message>
      <div className={styles.grid}>
        <InfoBlock
          icon={<HiOutlineInformationCircle />}
          iconText="Video Tutorial"
          title="Need help figuring things out?"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          link={{ title: 'Help Center', link: '/help' }}
        />
        <InfoBlock
          icon={<HiOutlineInformationCircle />}
          iconText="Timesheet"
          title="Need help figuring things out?"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          link={{ title: 'Help Center', link: '/help' }}
        />
        <InfoBlock
          icon={<HiOutlineInformationCircle />}
          iconText="Profile"
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
    </div>
  ) : (
    <div className="parent-container">
      <Message margin={'0'} variant="info">
        You have not been added to the employee list yet, please logout and log back in, in 24 hours
      </Message>
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
          iconText="Contact"
          title="Need help figuring things out?"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          link={{ title: 'Contact', link: '/contact' }}
        />
      </div>
    </div>
  );
};

export default DashboardScreen;
