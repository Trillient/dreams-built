import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py3">Copyright &copy; Dreams Built</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
