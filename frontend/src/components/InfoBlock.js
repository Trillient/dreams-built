import { Button, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import styles from './InfoBlock.module.css';
import { FiArrowRight } from 'react-icons/fi';

const InfoBlock = ({ icon, iconText, title, text, link }) => {
  return (
    <Card className={styles.card}>
      <Card.Title className={styles.title}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles['icon-text']}>{iconText}</span>
      </Card.Title>
      <Card.Body className={styles.body}>
        <div className={styles['body-title']}>{title}</div>
        {text}
      </Card.Body>
      <hr style={{ width: '0.5rem', color: 'gray', width: '100%' }} />
      <Card.Footer className={styles.footer}>
        <LinkContainer to={link.link}>
          <Button className={styles.button}>
            {link.title} <FiArrowRight />
          </Button>
        </LinkContainer>
      </Card.Footer>
    </Card>
  );
};

export default InfoBlock;
