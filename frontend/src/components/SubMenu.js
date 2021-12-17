import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import styles from './subMenu.module.css';

const SubMenu = ({ item }) => {
  const { logout } = useAuth0();
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);

  if (item.title === 'Logout') {
    return (
      <Link className={styles['sidebar-link']} onClick={() => logout({ returnTo: window.location.origin })}>
        <div>
          {item.icon}
          <span className={styles['sidebar-label']}>{item.title}</span>
        </div>
      </Link>
    );
  } else {
    return (
      <>
        <Link className={styles['sidebar-link']} to={item.path} onClick={item.subNav && showSubnav}>
          <div>
            {item.icon}
            <span className={styles['sidebar-label']}>{item.title}</span>
          </div>
          <div>{item.subNav && subnav ? item.iconOpened : item.subNav ? item.iconClosed : null}</div>
        </Link>
        {subnav &&
          item.subNav.map((item, index) => {
            return (
              <Link className={styles['dropdown-link']} to={item.path} key={index}>
                <span className={styles['sidebar-label']}>{item.title}</span>
              </Link>
            );
          })}
      </>
    );
  }
};
export default SubMenu;
