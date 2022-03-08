import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addRole, deleteRole, getProfile } from '../../actions/employeeActions';

import InfoBlock from '../../components/InfoBlock';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import styles from './dashboardScreen.module.css';

const DashboardScreen = () => {
  const { isLoading, error, user, getAccessTokenSilently } = useAuth0();
  const domain = process.env.REACT_APP_CUSTOM_DOMAIN;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.profile);
  const { userData } = userInfo;

  useEffect(() => {
    if (!userData) {
      (async () => {
        try {
          const token = await getAccessTokenSilently();
          dispatch(getProfile(token, user.sub));
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [dispatch, getAccessTokenSilently, user.sub, userData]);

  const changeRoleHandler = async (roleToDelete, roleToAdd) => {
    const token = await getAccessTokenSilently();
    dispatch(deleteRole(token, userData._id, roleToDelete));
    dispatch(addRole(token, userData._id, roleToAdd));
    navigate(0);
  };

  const removeRoleHandler = async (roleToDelete) => {
    const token = await getAccessTokenSilently();
    dispatch(deleteRole(token, userData._id, roleToDelete));
    navigate(0);
  };

  const addRoleHandler = async (roleToAdd) => {
    const token = await getAccessTokenSilently();
    dispatch(addRole(token, userData._id, roleToAdd));
    navigate(0);
  };

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
        <Button variant="danger" onClick={() => removeRoleHandler('admin')}>
          Remove admin Privileges
        </Button>
        <Button variant="success" onClick={() => changeRoleHandler('admin', 'employee')}>
          Try Employee Privileges
        </Button>
        <InfoBlock
          icon={<HiOutlineInformationCircle />}
          iconText="Schedule"
          title="Need help figuring things out?"
          text="Watch this explanation video, to learn how to use the Job Schedule."
          link={{ title: 'Help Center', link: 'https://www.loom.com/embed/8e22009ec07741768244878dfe84780b?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true' }}
        />
        <InfoBlock
          icon={<HiOutlineInformationCircle />}
          iconText="Job Reports"
          title="Need help figuring things out?"
          text="Watch this explanation video, to learn how to use the Reports."
          link={{ title: 'Help Center', link: 'https://www.loom.com/embed/590488f9bd704092af3c5ba508b3b435?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true' }}
        />
      </div>
    </div>
  ) : user[`${domain}/roles`].includes('Employee') ? (
    <div className="parent-container">
      <Message margin={'0'} variant="success">
        You're in the Employee portal
      </Message>
      <div className={styles.grid}>
        <Button variant="danger" onClick={() => removeRoleHandler('employee')}>
          Remove all Privileges
        </Button>
        <Button variant="info" onClick={() => changeRoleHandler('employee', 'admin')}>
          Try Admin Privileges
        </Button>
        <InfoBlock
          icon={<HiOutlineInformationCircle />}
          iconText="Video Tutorial"
          title="Need help figuring things out?"
          text="Watch this explanation video, to learn how to use the Employee Dashboard."
          link={{ title: 'Demo', link: 'https://www.loom.com/embed/80058a2a069d477b9bd194ad089fdc34?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true' }}
        />
        <InfoBlock icon={<HiOutlineInformationCircle />} iconText="Help Center" title="Need help figuring things out?" text="Contact us here." link={{ title: 'Help Center', link: null }} />
      </div>
    </div>
  ) : (
    <div className="parent-container">
      <Message margin={'0'} variant="success">
        Try out the Employee and Admin dashboards by accessing the roles with the buttons below.
      </Message>
      <div className={styles.grid}>
        <Button variant="info" onClick={() => addRoleHandler('admin')}>
          Try Admin Privileges
        </Button>
        <Button variant="info" onClick={() => addRoleHandler('employee')}>
          Try Employee Privileges
        </Button>
        <InfoBlock icon={<HiOutlineInformationCircle />} iconText="Contact" title="Need help figuring things out?" text="Contact us here." link={{ title: 'Contact', link: null }} />
        <InfoBlock icon={<HiOutlineInformationCircle />} iconText="Contact" title="Need help figuring things out?" text="Contact us here." link={{ title: 'Contact', link: null }} />
      </div>
    </div>
  );
};

export default withAuthenticationRequired(DashboardScreen, {
  onRedirecting: () => <Loader />,
});
