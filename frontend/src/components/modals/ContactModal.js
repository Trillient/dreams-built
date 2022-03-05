import { Modal } from 'react-bootstrap';

const ContactModal = ({ setModalShow, title, ...rest }) => {
  return (
    rest.show && (
      <Modal {...rest} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h1 style={{ fontSize: '1.7rem' }}>{title}</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: 'center' }}>
          <p>Contact Email:</p>
          <a href="email:bailey.nepe@gmail.com">bailey.nepe@gmail.com</a>
        </Modal.Body>
      </Modal>
    )
  );
};

export default ContactModal;
