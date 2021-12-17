import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container } from 'react-bootstrap';

import LoginButton from '../LoginButton';

import styles from './header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <div className={styles.topnav}>
            <div className={styles['display-none_mobile']}>
              <LinkContainer to="/">
                <Navbar.Brand>Dreams Built</Navbar.Brand>
              </LinkContainer>
            </div>
            <div className={styles.mobile}>
              <div className={styles.brand}>
                <LinkContainer to="/">
                  <Navbar.Brand>Dreams Built</Navbar.Brand>
                </LinkContainer>
              </div>
              <div className={styles.toggle}>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
              </div>
              <div className={styles.collapse}>
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav>
                    <LinkContainer to="/">
                      <Nav.Link>Home</Nav.Link>
                    </LinkContainer>
                    <div className={styles.login}>
                      <LoginButton />
                    </div>
                  </Nav>
                </Navbar.Collapse>
              </div>
            </div>
            <div className={styles['display-none_mobile']}>
              <LoginButton />
            </div>
          </div>
        </Container>
      </Navbar>
    </header>
  );
};
export default Header;
