import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth0 } from '@auth0/auth0-react';
import { SiAmazonaws, SiAuth0, SiBootstrap, SiDocker, SiExpress, SiHeroku, SiJest, SiMongodb, SiNetlify, SiNodedotjs, SiReact, SiRedux } from 'react-icons/si';

import { contactFormPost } from '../../actions/contactActions';

import styles from './homeScreen.module.css';

const HomeScreen = () => {
  const { loginWithRedirect } = useAuth0();
  const dispatch = useDispatch();

  const contactForm = useSelector((state) => state.contact);
  const { contactFormLoading, contactFormSuccess } = contactForm;

  const limit = 1000;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const reRef = useRef();

  const setFormattedMessage = useCallback(
    (text) => {
      setMessage(text.slice(0, limit));
    },
    [limit, setMessage]
  );

  useEffect(() => {
    if (contactFormSuccess) {
      setFormattedMessage('');
      setEmail('');
      setName('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactFormSuccess]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await reRef.current.executeAsync();
    reRef.current.reset();
    dispatch(contactFormPost(name, email, message, token));
  };

  return (
    <>
      <Container>
        <section className={styles.block} style={{ margin: '3.5rem 0' }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: '0' }}>
            <iframe
              src="https://www.loom.com/embed/8e22009ec07741768244878dfe84780b?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true"
              frameBorder="0"
              title="demo"
              allowFullScreen
              style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', borderRadius: '0.4rem', boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}
            ></iframe>
          </div>
        </section>

        <section className={styles.block}>
          <h1 style={{ textAlign: 'center' }}>About</h1>
          <p style={{ padding: '1rem 0' }}>
            This application is a holistic approach to tracking job schedules, job labour costs, and employee timesheets. The application may be beneficial to small to medium sized businesses in various industry sectors. Role Based Access Control is
            utilised to enable employers or administrators to create new jobs and schedule them as required according to the business's unique specifications via 'job parts'. Employees are able to then enter their weekly timesheet and assign their
            labour to an existing job. The administrators or employers are able to see timesheet reports based on the employee entries.
          </p>

          <a href="https://github.com/BaileyNepe/dreams-built" className="btn btn-primary" style={{ display: 'block', margin: '0 auto', width: 'max-content' }} target="_blank" rel="noopener noreferrer">
            View The Code
          </a>
        </section>

        <section className={styles.block}>
          <div className={styles.stack}>
            <SiMongodb style={{ color: '#69AF56' }} /> <SiExpress /> <SiReact style={{ color: '#61DAFB' }} /> <SiNodedotjs style={{ color: '#94C190' }} /> <SiRedux style={{ color: '#764ABC' }} /> <SiDocker style={{ color: '#2596ED' }} /> <SiAuth0 />{' '}
            <SiJest style={{ color: '#15C214' }} /> <SiBootstrap style={{ color: '#563D7C' }} /> <SiAmazonaws /> <SiNetlify style={{ color: '#44A3BD' }} /> <SiHeroku style={{ color: '#430098' }} />
          </div>
        </section>
      </Container>
      <section className={styles.block} style={{ marginBottom: '4rem' }}>
        <Container className={styles.divide}>
          <div className={styles.try}>
            <h2 style={{ paddingBottom: '0.7rem', fontSize: '1.7rem' }}>Try it out</h2>
            <p>Try it out for yourself by either registering your own account or using the following login credentials:</p>
            <p>
              <strong>Username:</strong> <em>test@test.com</em>
            </p>
            <p>
              <strong>Password:</strong> <em>Password_123</em>
            </p>
            <Button onClick={() => loginWithRedirect()}>Login / Sign up</Button>
          </div>
          <Form onSubmit={submitHandler} className={styles.form}>
            <h2 className={styles['contact-title']}>Contact</h2>
            <Form.Group className={styles.name}>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group className={styles.email}>
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group className={styles.message}>
              <Form.Label>Message</Form.Label>
              <Form.Control style={{ width: '100%', padding: '0.5rem 0.7rem', minHeight: '10rem' }} as="textarea" placeholder="Begin message..." value={message} onChange={(e) => setFormattedMessage(e.target.value)} />
              <p style={{ color: 'grey', fontStyle: 'italic', textAlign: 'right' }}>
                {message.length}/{limit}
              </p>
            </Form.Group>
            <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY} size="invisible" ref={reRef} />
            <Button className={styles.send} disabled={!message || !name || !email || contactFormLoading} type="submit">
              {contactFormLoading ? 'Sending...' : 'Submit'}
            </Button>
          </Form>
        </Container>
      </section>
    </>
  );
};

export default HomeScreen;
