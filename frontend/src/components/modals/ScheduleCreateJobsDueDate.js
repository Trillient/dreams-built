import React from 'react';
import { Button, Modal } from 'react-bootstrap';

export const ScheduleCreateJobsDueDate = ({ setModalShow, ...rest }) => {
  return (
    <Modal {...rest} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        <Button variant="secondary" onClick={() => setModalShow(false)}>
          Close
        </Button>
      </Modal.Header>
      <Modal.Body>Create all</Modal.Body>
    </Modal>
  );
};
