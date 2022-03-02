import { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { FiArrowRight } from 'react-icons/fi';

import styles from './infoBlock.module.css';

import VideoModal from './modals/VideoModal';

const InfoBlock = ({ icon, iconText, title, text, link }) => {
  const [modalShow, setModalShow] = useState(false);
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
      <hr style={{ color: 'gray', width: '100%' }} />
      <Card.Footer className={styles.footer}>
        <Button className={styles.button} onClick={setModalShow}>
          {link.title} <FiArrowRight />
        </Button>
        <VideoModal show={modalShow} setModalShow={setModalShow} src={link.link} title={title} onHide={() => setModalShow(false)} />
      </Card.Footer>
    </Card>
  );
};

export default InfoBlock;
