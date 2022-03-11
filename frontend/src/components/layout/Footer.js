import { Container } from 'react-bootstrap';
import { BsGithub, BsLinkedin } from 'react-icons/bs';

import styles from './layout.module.css';

const Footer = () => {
  return (
    <footer className={`${styles.footer} ${'bg-dark'}`}>
      <Container className={styles['footer-container']}>
        <div className={styles.copyright}> Dreams Built &copy; {new Date().getFullYear()}</div>
        <div className={styles.social}>
          <a href="http://github.com/BaileyNepe/dreams-built" target="_blank" rel="noopener noreferrer">
            <BsGithub />
          </a>
          <a href="http://linkedin.com/in/bailey-nepe" target="_blank" rel="noopener noreferrer">
            <BsLinkedin />
          </a>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
