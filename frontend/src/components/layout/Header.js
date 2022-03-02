import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, Image } from 'react-bootstrap';

import LoginButton from '../LoginButton';

import styles from './header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <Navbar bg="light" variant="light" expand="lg" collapseOnSelect>
        <Container>
          <div className={styles.topnav}>
            <div className={styles['display-none_mobile']}>
              <LinkContainer to="/">
                <Navbar.Brand>
                  <Image className={styles.logo} src="logo-min.png" />
                </Navbar.Brand>
              </LinkContainer>
            </div>
            <div className={styles.mobile}>
              <div className={styles.brand}>
                <LinkContainer to="/">
                  <Navbar.Brand>
                    <Image className={styles.logo} src="logo-min.png" />
                  </Navbar.Brand>
                </LinkContainer>
              </div>
              <div className={styles.toggle}>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
              </div>
              <div className={styles.collapse}>
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav>
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
