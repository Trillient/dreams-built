import { FaBars } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';
import { Link } from 'react-router-dom';

import styles from './sidebar.module.css';

const SidebarHeader = ({ sidebar, setSidebar }) => {
  return (
    <div className={styles.nav}>
      <IconContext.Provider value={{ color: '#fff' }}>
        {!sidebar && (
          <Link to="#" className={styles['nav-icon']}>
            <FaBars onClick={() => setSidebar(true)} />
          </Link>
        )}
      </IconContext.Provider>
    </div>
  );
};

export default SidebarHeader;
