import { Button, Modal } from 'react-bootstrap';

const DeleteConfirmationModal = ({ setModalShow, handleDeleteTrue, title, ...rest }) => {
  return (
    <Modal {...rest} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <h1 style={{ fontSize: '1.6rem' }}>Delete "{title}" ?</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ textAlign: 'center' }}>
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
        <Button
          variant="secondary"
          onClick={() => {
            setModalShow(false);
          }}
          style={{ marginLeft: '0.5rem' }}
        >
          Cancel
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteConfirmationModal;
