import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Carousel, Container, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';

import { contactFormPost } from '../../actions/contactActions';

import Loader from '../../components/Loader';

import styles from './homeScreen.module.css';

const HomeScreen = () => {
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
        <section>Intro Video</section>
        <section>About the app + Login credentials</section>
        {/* <section>
          <h2>Features</h2>
          <Carousel fade>
            <Carousel.Item>
              <img className="d-block w-100" alt="First slide" />
              <Carousel.Caption>
                <h3>First slide label</h3>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src="holder.js/800x400?text=Second slide&bg=282c34" alt="Second slide" />

              <Carousel.Caption>
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src="holder.js/800x400?text=Third slide&bg=20232a" alt="Third slide" />

              <Carousel.Caption>
                <h3>Third slide label</h3>
                <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </section> */}
      </Container>
      <section className={styles['contact-block']}>
        <Container>
          <Form onSubmit={submitHandler} className={styles.form}>
            {contactFormLoading ? (
              <Loader />
            ) : (
              <>
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
                <Button className={styles.send} disabled={!message || !name || !email} type="submit">
                  Send
                </Button>
              </>
            )}
          </Form>
        </Container>
      </section>
    </>
  );
};

export default HomeScreen;
