import { Link } from 'react-router-dom';

import { AiOutlineClose } from 'react-icons/ai';

import { UnAuthenticatedSidebarData, EmployeeSidebarData, AdminSidebarData } from '../../data/SidebarData';
import SubMenu from '../SubMenu';

import styles from './sidebar.module.css';
import { IconContext } from 'react-icons/lib';
import { useAuth0 } from '@auth0/auth0-react';
import Loader from '../Loader';

const Sidebar = ({ setSidebar }) => {
  const { isLoading, user } = useAuth0();
  const domain = process.env.REACT_APP_CUSTOM_DOMAIN;
  return isLoading ? (
    <Loader />
  ) : (
    <nav className={styles['sidebar-nav']}>
      <div className={styles['sidebar-wrap']}>
        <IconContext.Provider value={{ color: '#fff' }}>
          <Link to="#" className={styles['nav-icon']}>
            <AiOutlineClose onClick={() => setSidebar(false)} />
          </Link>
          {user[`${domain}/roles`].includes('Admin')
            ? AdminSidebarData.map((item, index) => <SubMenu item={item} key={index} setSidebar={setSidebar} />)
            : user[`${domain}/roles`].includes('Employee')
            ? EmployeeSidebarData.map((item, index) => <SubMenu item={item} key={index} setSidebar={setSidebar} />)
            : UnAuthenticatedSidebarData.map((item, index) => <SubMenu item={item} key={index} setSidebar={setSidebar} />)}
        </IconContext.Provider>
      </div>
    </nav>
  );
};

export default Sidebar;
