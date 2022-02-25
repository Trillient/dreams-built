import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';

import { createJobPartDueDate, getDueDate, updateWholeJobPartDueDate } from '../../actions/jobActions';

import Message from '../Message';

import styles from './scheduleCreateDueDate.module.css';

const ScheduleCreateDueDate = ({ setModalShow, date, jobPart, ...rest }) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const jobsList = useSelector((state) => state.jobsList);
  const { loading, error, jobList } = jobsList;
  const contractorsList = useSelector((state) => state.contractors);
  const { contractorList } = contractorsList;
  const savedDueDate = useSelector((state) => state.jobDueDates);
  const { jobDueDate } = savedDueDate;

  const [job, setJob] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState(date);
  const [contractors, setContractors] = useState([]);

  useEffect(() => {
    setDueDate(date);
    if (job) {
      (async () => {
        const token = await getAccessTokenSilently();
        dispatch(getDueDate(token, jobPart._id, job._id));
      })();
    }
  }, [date, dispatch, getAccessTokenSilently, job, jobPart]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = await getAccessTokenSilently();
    if (jobDueDate.length > 0) {
      dispatch(updateWholeJobPartDueDate(token, jobDueDate[0]._id, dueDate, startDate, contractors));
    } else {
      dispatch(createJobPartDueDate(token, job._id, jobPart._id, dueDate, startDate, contractors));
    }
    setModalShow(false);
  };

  return (
    rest.show &&
    !loading &&
    (error ? (
      <Message variant="danger">{error}</Message>
    ) : (
      <Modal {...rest} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h1 className={styles.title}>{jobPart.jobPartTitle}</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className={styles.form} onSubmit={submitHandler}>
            <Form.Group>
              <Form.Label>Job:</Form.Label>
              <Select
                placeholder="22000 - 123 Abc place..."
                menuPosition={'fixed'}
                isClearable="true"
                onChange={setJob}
                options={
                  jobList &&
                  jobList.map((option) => {
                    return { ...option, label: `${option.jobNumber} - ${option.address}, ${option.city}`, value: option._id };
                  })
                }
              />
            </Form.Group>
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
          </Form>
        </Modal.Body>
      </Modal>
    ))
  );
};

export default ScheduleCreateDueDate;
