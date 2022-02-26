import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import Select from 'react-select';

import { deleteJobPartDueDate, updateWholeJobPartDueDate } from '../../actions/jobActions';

import styles from './scheduleEditDueDate.module.css';

const ScheduleEditDueDate = ({ setModalShow, job, jobPart, ...rest }) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const contractorsList = useSelector((state) => state.contractors);
  const { contractorList } = contractorsList;

  const [startDate, setStartDate] = useState(job.startDate ? job.startDate : '');
  const [dueDate, setDueDate] = useState(job.dueDate ? job.dueDate : '');
  const [contractors, setContractors] = useState(
    job.contractors
      ? job.contractors.map((contractor) => {
          return { ...contractor, label: contractor.contractor, value: contractor._id };
        })
      : []
  );

  useEffect(() => {
    setStartDate(job.startDate ? job.startDate : '');
    setDueDate(job.dueDate ? job.dueDate : '');
    setContractors(
      job.contractors
        ? job.contractors.map((contractor) => {
            return { ...contractor, label: contractor.contractor, value: contractor._id };
          })
        : []
    );
  }, [job.dueDate, job.startDate, job.contractors]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(updateWholeJobPartDueDate(token, job._id, dueDate, startDate, contractors));
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
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h1 className={styles.title}>{jobPart.jobPartTitle}</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LinkContainer className={styles.link} to={`/job/details/${job.job._id}`}>
            <a href="/#">Job Details</a>
          </LinkContainer>
          <Form className={styles.form} onSubmit={submitHandler}>
            <h2 className={styles['sub-title']}>
              {job.job.jobNumber} - {job.job.address}
            </h2>
            <Form.Group className={styles.start}>
              <Form.Label>Start Date:</Form.Label>
              <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group className={styles.due}>
              <Form.Label>Due Date:</Form.Label>
              <Form.Control type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group className={styles.contractors}>
              <Form.Label>Contractors:</Form.Label>
              <Select
                menuPosition={'fixed'}
                isClearable="true"
                placeholder="Add Contractor..."
                isMulti
                closeMenuOnSelect="false"
                defaultValue={
                  job.contractors
                    ? job.contractors.map((contractor) => {
                        return { ...contractor, label: contractor.contractor, value: contractor._id };
                      })
                    : []
                }
                onChange={setContractors}
                options={
                  contractorList &&
                  contractorList.map((contractor) => {
                    return { ...contractor, label: contractor.contractor, value: contractor._id };
                  })
                }
              />
            </Form.Group>
            <Button className={styles.save} type="submit" variant="success">
              Save
            </Button>
            <Button className={styles.delete} variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    )
  );
};

export default ScheduleEditDueDate;
