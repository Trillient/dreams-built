import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { getJobDueDates } from '../../actions/jobActions';

import JobPartDueDates from '../JobPartDueDates';

import styles from './scheduleCreateJobsDueDate.module.css';

export const ScheduleCreateJobsDueDate = ({ setModalShow, ...rest }) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const jobsList = useSelector((state) => state.jobsList);
  const { jobList } = jobsList;
  const jobPartsList = useSelector((state) => state.jobParts);
  const { jobParts } = jobPartsList;

  const [job, setJob] = useState('');

  useEffect(() => {
    if (!rest.show) {
      setJob('');
    }
    if (job) {
      (async () => {
        const token = await getAccessTokenSilently();
        dispatch(getJobDueDates(token, job._id));
      })();
    }
  }, [dispatch, getAccessTokenSilently, job, rest.show]);
  return (
    rest.show && (
      <Modal {...rest} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">Create Job Due Dates</Modal.Title>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body className={styles.body}>
          <Form.Group className={styles.job}>
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
          {job && jobParts && jobParts.map((jobPart) => <JobPartDueDates key={jobPart._id} jobId={job._id} jobPart={jobPart} />)}
        </Modal.Body>
      </Modal>
    )
  );
};
//48rem media query
//62rem media query
