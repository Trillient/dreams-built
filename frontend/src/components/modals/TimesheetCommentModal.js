import { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateComments } from '../../actions/timesheetActions';

const TimesheetCommentModal = ({ setModalShow, day, date, ordinal, month, ...rest }) => {
  const dispatch = useDispatch();
  const commentEntries = useSelector((state) => state.timesheet);
  const { comments } = commentEntries;
  const commentExists = comments.filter((comment) => comment.day === day && comment.comments !== '').length > 0 ? comments.filter((comment) => comment.day === day)[0].comments : '';
  const [comment, setComment] = useState(commentExists);

  useEffect(() => {
    dispatch(updateComments(day, comment));
  }, [day, comment, dispatch]);

  return (
    <Modal {...rest} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1 style={{ fontSize: '1.6rem' }}>
            {day} - {date}
            <sup>{ordinal}</sup> {month}
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId={`comments`}>
          <Form.Label>Comments:</Form.Label>
          <Form.Control style={{ width: '100%', padding: '0.5rem 0.7rem', minHeight: '10rem' }} as="textarea" placeholder="Begin message..." value={comment} onChange={(e) => setComment(e.target.value)} />
        </Form.Group>
      </Modal.Body>
    </Modal>
  );
};

export default TimesheetCommentModal;
