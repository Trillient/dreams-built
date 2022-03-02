import { Modal } from 'react-bootstrap';

const VideoModal = ({ setModalShow, title, src, ...rest }) => {
  return (
    rest.show && (
      <Modal {...rest} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h1 style={{ fontSize: '1.7rem' }}>{title}</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: '0' }}>
            <iframe src={src} frameBorder="0" title={title} allowFullScreen style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}></iframe>
          </div>
        </Modal.Body>
      </Modal>
    )
  );
};

export default VideoModal;
