import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import styles from './layout.module.css';

const Footer = () => {
  return (
    <footer bg="light" variant="light" className={styles.footer}>
      <Container>
        <Row>
          <Col className="text-center py3 m-3">Copyright &copy; {new Date().getFullYear()} Dreams Built</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
