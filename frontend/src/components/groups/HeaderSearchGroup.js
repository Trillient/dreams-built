import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import SearchBox from '../SearchBox';

import styles from './headerSearchGroup.module.css';

const HeaderSearchGroup = ({ setSearch, link, title, addition = true }) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.add}>
        {addition && (
          <LinkContainer to={link}>
            <Button className={styles.btn}>+</Button>
          </LinkContainer>
        )}
      </div>
      <div className={styles.search}>
        <SearchBox setSearch={setSearch} />
      </div>
    </div>
  );
};

export default HeaderSearchGroup;
