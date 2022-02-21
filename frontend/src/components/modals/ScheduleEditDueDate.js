import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import Select from 'react-select';

import { deleteJobPartDueDate, updateJobPartDueDate } from '../../actions/jobActions';

const ScheduleEditDueDate = ({ setModalShow, date, job, jobPart, modalDueDate, ...rest }) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const contractorsList = useSelector((state) => state.contractors);
  const { contractorList } = contractorsList;

  const [startDate, setStartDate] = useState(job.startDate ? job.startDate : '');
  const [dueDate, setDueDate] = useState(job.dueDate ? job.dueDate : '');
  const [setContractors] = useState([]);

  useEffect(() => {
    setStartDate(job.startDate ? job.startDate : '');
    setDueDate(job.dueDate ? job.dueDate : '');
  }, [job.dueDate, job.startDate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(updateJobPartDueDate(token, job._id, dueDate, startDate));
    setModalShow(false);
  };

  const handleDelete = async () => {
    const token = await getAccessTokenSilently();
    dispatch(deleteJobPartDueDate(token, job._id));
    setModalShow(false);
  };

  return (
    rest.show && (
      <Modal {...rest} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
          <LinkContainer to={`/job/details/${job.job._id}`}>
            <Button className="btn-sm">Job Details</Button>
          </LinkContainer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={submitHandler}>
            <h2>{jobPart.jobPartTitle}</h2>
            <h3>
              {job.job.jobNumber} - {job.job.address} - {job._id}
            </h3>
            <Form.Group controlId={jobPart.jobPartTitle.startDate}>
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId={jobPart.jobPartTitle.dueDate}>
              <Form.Label>Due Date</Form.Label>
              <Form.Control type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}></Form.Control>
            </Form.Group>
            <Select
              menuPosition={'fixed'}
              isClearable="true"
              placeholder="Add Contractor..."
              isMulti
              closeMenuOnSelect="false"
              onChange={setContractors}
              options={
                contractorList &&
                contractorList.map((contractor) => {
                  return { ...contractor, label: contractor.contractor, value: contractor._id };
                })
              }
            />
            <Button type="submit" variant="success">
              Save
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    )
  );
};

export default ScheduleEditDueDate;
