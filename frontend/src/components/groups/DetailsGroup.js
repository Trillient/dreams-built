import { BsArrowLeft } from 'react-icons/bs';
import { Link } from 'react-router-dom';

import styles from './detailsGroup.module.css';

const DetailsGroup = ({ children, title = null, link = '/', linkName = 'Back', width = 'screenDefault' }) => {
  return (
    <div className="container">
      <div className={width === 'screenDefault' ? `${styles.card}` : `${styles.card} ${styles.large}`}>
        <div className={styles.grid}>
          <div className={styles.link}>
            <Link to={link} className="btn btn-secondary my-3">
              <BsArrowLeft /> {linkName}
            </Link>
          </div>
          <h1 className={styles.title}>{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
};

export default DetailsGroup;
