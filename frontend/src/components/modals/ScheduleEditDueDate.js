import { Button, Modal } from 'react-bootstrap';

const ScheduleEditDueDate = ({ setModalShow, date, job, jobPart, ...rest }) => {
  return (
    <Modal {...rest} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        <Button variant="secondary" onClick={() => setModalShow(false)}>
          Close
        </Button>
      </Modal.Header>
      <Modal.Body>
        {date} - {jobPart.jobPartTitle} - {job.jobNumber}
      </Modal.Body>
    </Modal>
  );
};

export default ScheduleEditDueDate;
