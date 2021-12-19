import { Link } from 'react-router-dom';

import { AiOutlineClose } from 'react-icons/ai';

import { SidebarData } from '../SidebarData';
import SubMenu from '../SubMenu';

import styles from './sidebar.module.css';
import { IconContext } from 'react-icons/lib';

const Sidebar = ({ setSidebar }) => {
  return (
    <nav className={styles['sidebar-nav']}>
      <div className={styles['sidebar-wrap']}>
        <IconContext.Provider value={{ color: '#fff' }}>
          <Link to="#" className={styles['nav-icon']}>
            <AiOutlineClose onClick={() => setSidebar(false)} />
          </Link>
          {SidebarData.map((item, index) => (
            <SubMenu item={item} key={index} setSidebar={setSidebar} />
          ))}
        </IconContext.Provider>
      </div>
    </nav>
  );
};

export default Sidebar;
