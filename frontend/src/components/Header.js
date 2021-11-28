import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';

import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton';

const Header = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <header className="header">
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Dreams Built</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/timesheet">
                <Nav.Link>Sheet</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/schedule">
                <Nav.Link>Schedule</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/jobslist">
                <Nav.Link>Jobs</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/profile">
                <Nav.Link>Profile</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
          <Nav className="justify-content-end">{isAuthenticated ? <LogoutButton /> : <LoginButton />}</Nav>
        </Container>
      </Navbar>
    </header>
  );
};
export default Header;
