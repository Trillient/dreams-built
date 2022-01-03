import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import styles from './subMenu.module.css';

const SubMenu = ({ item, setSidebar }) => {
  const { logout } = useAuth0();
  const [subnav, setSubnav] = useState(false);

  const getWindowDimensions = () => {
    const { innerWidth: width } = window;
    return width;
  };

  const showSubnav = () => setSubnav(!subnav);

  const checkScreen = (subNav) => {
    const width = getWindowDimensions();
    if (subNav) {
      showSubnav();
    } else {
      if (width <= 799) {
        setSidebar(false);
      }
    }
  };

  if (item.title === 'Logout') {
    return (
      <div className={styles['sidebar-link']} onClick={() => logout({ returnTo: window.location.origin })}>
        <div>
          {item.icon}
          <span className={styles['sidebar-label']}>{item.title}</span>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <Link className={styles['sidebar-link']} to={item.path ? item.path : '#'} onClick={() => checkScreen(item.subNav)}>
          <div>
            {item.icon}
            <span className={styles['sidebar-label']}>{item.title}</span>
          </div>
          <div>{item.subNav && subnav ? item.iconOpened : item.subNav ? item.iconClosed : null}</div>
        </Link>
        {subnav &&
          item.subNav.map((item, index) => {
            return (
              <Link className={styles['dropdown-link']} to={item.path} key={index} onClick={() => (getWindowDimensions() <= 799 ? setSidebar(false) : null)}>
                <span className={styles['sidebar-label']}>{item.title}</span>
              </Link>
            );
          })}
      </>
    );
  }
};
export default SubMenu;
