import { Button, Modal } from 'react-bootstrap';

const DeleteConfirmationModal = ({ setModalShow, handleDeleteTrue, title, ...rest }) => {
  return (
    <Modal {...rest} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Body style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '2rem' }}>Delete "{title}" ?</h1>
        <Button
          variant="danger"
          onClick={() => {
            handleDeleteTrue();
            setModalShow(false);
          }}
          style={{ marginRight: '0.5rem' }}
        >
          Delete
        </Button>
        <Button variant="secondary" onClick={() => setModalShow(false)} style={{ marginLeft: '0.5rem' }}>
          Close
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteConfirmationModal;
