import { useAuth0 } from '@auth0/auth0-react';
import { DateTime } from 'luxon';
import { useEffect } from 'react';
import { useState } from 'react';
import { Form, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getEmployeeTimeSheets } from '../../actions/reportActions';
import EmployeeRow from '../../components/EmployeeRow';

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
  console.log(weekStart);

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
            <h2>{job.jobNumber}</h2>
            <p>
              <strong>
                <em>
                  {job.value[0].weekStart} - {job.value[0].weekEnd}
                </em>
              </strong>
            </p>
            <Table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Rate ($/hr)</th>
                  <th>Cost</th>
                  <th>Times</th>
                </tr>
              </thead>
              <tbody>
                {job.value.map((entry) => (
                  <tr key={entry._id}>
                    <td>
                      {entry.user.firstName} {entry.user.lastName}
                    </td>
                    <td>$ {entry.user.hourlyRate}</td>
                    <td>$ {entry.user.hourlyRate * entry.jobTime}</td>
                    <td>{entry.jobTime}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th>Total</th>
                  <td></td>
                  <td>$ {job.value.map((entry) => entry.jobTime * entry.user.hourlyRate).reduce((previous, current) => previous + current, 0)}</td>
                  <td>{job.value.map((entry) => entry.jobTime).reduce((previous, current) => previous + current, 0)}</td>
                </tr>
              </tfoot>
            </Table>
          </div>
        ))}
      {timesheets.sortedByEmployee &&
        timesheets.sortedByEmployee.map((user) => (
          <div key={user.userId} className={styles.card}>
            <h2>
              {user.value[0].user.firstName} {user.value[0].user.lastName}
            </h2>
            <p>
              <strong>
                <em>
                  {user.value[0].weekStart} - {user.value[0].weekEnd}
                </em>
              </strong>
            </p>
            <Table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Total Time</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {user.value.map((entry) => (
                  <EmployeeRow entry={entry} key={entry._id} />
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th>Total</th>
                  <td></td>
                  <td></td>
                  <td>{user.value.map((entry) => entry.jobTime).reduce((previous, current) => previous + current, 0)}</td>
                </tr>
              </tfoot>
            </Table>
          </div>
        ))}
    </>
  );
};

export default TimeSheetReportScreen;
