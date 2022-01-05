import { useAuth0 } from '@auth0/auth0-react';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

import { useState } from 'react';
import SidebarHeader from './SidebarHeader';
import styles from './layout.module.css';

const Layout = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  const [sidebar, setSidebar] = useState(true);

  return isLoading ? null : isAuthenticated ? (
    <div className={styles.transition}>
      <div className={sidebar ? styles['side-menu-grid'] : styles['clean-menu-grid']}>
        <div className={styles.header}>
          <SidebarHeader setSidebar={setSidebar} sidebar={sidebar} />
        </div>
        <div className={styles.sidebar} style={sidebar ? null : { display: 'none' }}>
          <Sidebar setSidebar={setSidebar} />
        </div>
        <div className={styles.main}>{children}</div>
      </div>
    </div>
  ) : (
    <div className={styles.grid}>
      <Header />
      <div className={styles.main}>{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
