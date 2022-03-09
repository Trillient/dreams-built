import { useCallback, useState } from 'react';
import { Button, Carousel, Container, Form } from 'react-bootstrap';

import styles from './homeScreen.module.css';

const HomeScreen = () => {
  const limit = 1000;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const setFormattedMessage = useCallback(
    (text) => {
      setMessage(text.slice(0, limit));
    },
    [limit, setMessage]
  );

  const submitHandler = () => {
    console.log('clicked');
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
            <h2 className={styles['contact-title']}>Contact</h2>
            <Form.Group className={styles.name}>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group className={styles.email}>
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group className={styles.subject}>
              <Form.Label>Subject</Form.Label>
              <Form.Control type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </Form.Group>

            <Form.Group className={styles.message}>
              <Form.Label>Message</Form.Label>
              <Form.Control style={{ width: '100%', padding: '0.5rem 0.7rem', minHeight: '10rem' }} as="textarea" placeholder="Begin message..." value={message} onChange={(e) => setFormattedMessage(e.target.value)} />
              <p style={{ color: 'grey', fontStyle: 'italic', textAlign: 'right' }}>
                {message.length}/{limit}
              </p>
            </Form.Group>

            <Button className={styles.send} disabled={!message || !name || !subject} type="submit">
              Send
            </Button>
          </Form>
        </Container>
      </section>
    </>
  );
};

export default HomeScreen;
