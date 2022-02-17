import { Button, Modal } from 'react-bootstrap';

const ScheduleCreateDueDate = ({ setModalShow, date, jobPart, ...rest }) => {
  return (
    <Modal {...rest} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        <Button variant="secondary" onClick={() => setModalShow(false)}>
          Close
        </Button>
      </Modal.Header>
      <Modal.Body>
        {date} - {jobPart.jobPartTitle} - destint
      </Modal.Body>
    </Modal>
  );
};

export default ScheduleCreateDueDate;
