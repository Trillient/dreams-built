import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import styles from './layout.module.css';

const Footer = () => {
  return (
    <footer className={`${styles.footer} ${'bg-dark'}`}>
      <Container>
        <Row>
          <Col className="text-center py3 m-3"> Dreams Built &copy; {new Date().getFullYear()}</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
