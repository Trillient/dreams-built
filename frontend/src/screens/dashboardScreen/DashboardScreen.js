import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
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
        You're in the Admin portal
      </Message>
      <div className={styles.grid}>
        <InfoBlock icon={<HiOutlineInformationCircle />} iconText="Schedule" title="Need help figuring things out?" text="Watch this explanation video, to learn how to use the Job Schedule." link={{ title: 'Help Center', link: '/help' }} />
        <InfoBlock icon={<HiOutlineInformationCircle />} iconText="Job Reports" title="Need help figuring things out?" text="Watch this explanation video, to learn how to use the Reports." link={{ title: 'Help Center', link: '/help' }} />
      </div>
    </div>
  ) : user[`${domain}/roles`].includes('Employee') ? (
    <div className="parent-container">
      <Message margin={'0'} variant="success">
        You're in the Employee portal
      </Message>
      <div className={styles.grid}>
        <InfoBlock
          icon={<HiOutlineInformationCircle />}
          iconText="Video Tutorial"
          title="Need help figuring things out?"
          text="Watch this explanation video, to learn how to use the Employee Dashboard."
          link={{ title: 'Demo', link: 'https://www.loom.com/embed/89ea8e4453e241ba93ccc27f0fbf8390?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true' }}
        />
        <InfoBlock icon={<HiOutlineInformationCircle />} iconText="Help Center" title="Need help figuring things out?" text="Contact us here." link={{ title: 'Help Center', link: null }} />
      </div>
    </div>
  ) : (
    <div className="parent-container">
      <Message margin={'0'} variant="info">
        You have not been added to the employee list yet, please contact your employer.
      </Message>
      <div className={styles.grid}>
        <InfoBlock icon={<HiOutlineInformationCircle />} iconText="Contact" title="Need help figuring things out?" text="Contact us here." link={{ title: 'Contact', link: '/contact' }} />
        <InfoBlock icon={<HiOutlineInformationCircle />} iconText="Contact" title="Need help figuring things out?" text="Contact us here." link={{ title: 'Contact', link: '/contact' }} />
      </div>
    </div>
  );
};

export default withAuthenticationRequired(DashboardScreen, {
  onRedirecting: () => <Loader />,
});
