import { useAuth0 } from '@auth0/auth0-react';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { getEmployeeTimeSheets } from '../../actions/reportActions';

import EmployeeReportCard from '../../components/EmployeeReportCard';
import JobReportCard from '../../components/JobReportCard';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

import styles from './timesheetReports.module.css';

const TimeSheetReportScreen = () => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const timesheetList = useSelector((state) => state.reports);
  const { loading, error, timesheets } = timesheetList;

  const startWeekInit = DateTime.now().startOf('week');

  const [weekStart, setWeekStart] = useState(startWeekInit.toFormat('dd/MM/yyyy'));

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently();
        dispatch(getEmployeeTimeSheets(token, weekStart));
      } catch (err) {
        toast.error(err);
      }
    })();
  }, [dispatch, getAccessTokenSilently, weekStart]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <Form>
        <Form.Group controlId="date">
          <Form.Label>Pay Week</Form.Label>
          <Form.Control type="date" value={weekStart} onChange={(e) => setWeekStart(DateTime.fromFormat(e.target.value, 'yyyy-MM-dd').startOf('week').toFormat('dd/MM/yyyy'))}></Form.Control>
        </Form.Group>
      </Form>
      {timesheets.sortedByEmployee &&
        timesheets.sortedByJob.map((job) => (
          <div key={job.jobNumber} className={styles.card}>
            <JobReportCard job={job} />
          </div>
        ))}
      {timesheets.sortedByEmployee &&
        timesheets.sortedByEmployee.map((employee) => (
          <div key={employee.userId} className={styles.card}>
            <EmployeeReportCard employee={employee} />
          </div>
        ))}
    </>
  );
};

export default TimeSheetReportScreen;
