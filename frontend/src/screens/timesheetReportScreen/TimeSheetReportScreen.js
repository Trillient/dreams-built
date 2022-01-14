import { useAuth0 } from '@auth0/auth0-react';
import { DateTime } from 'luxon';
import { useEffect } from 'react';
import { useState } from 'react';
import { Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getEmployeeTimeSheets } from '../../actions/reportActions';

import Loader from '../../components/Loader';
import Message from '../../components/Message';

const TimeSheetReportScreen = () => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const timesheetList = useSelector((state) => state.reports);
  const { loading, error, timesheets } = timesheetList;

  const startWeekInit = DateTime.now().startOf('week');

  const [weekStart] = useState(startWeekInit.toFormat('dd/MM/yyyy'));

  let weekArray = [];
  for (let i = 0; i < 7; i++) {
    weekArray.push({
      day: DateTime.fromFormat(weekStart, 'yyyy/MM/dd').plus({ days: i }).toFormat('EEEE'),
      date: DateTime.fromFormat(weekStart, 'yyyy/MM/dd').plus({ days: i }).toFormat('dd/MM/yyyy'),
      shortDate: DateTime.fromFormat(weekStart, 'yyyy/MM/dd').plus({ days: i }).toFormat('d MMM'),
    });
  }

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
      {timesheets.sortedByEmployee &&
        timesheets.sortedByJob.map((job) => (
          <div key={job.jobNumber}>
            <h2>{job.jobNumber}</h2>
            <Table>
              <thead>
                <tr>
                  <th>Employee</th>
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
                    <td>$ {entry.user.hourlyRate * entry.jobTime}</td>
                    <td>{entry.jobTime}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th>Total</th>
                  <td>$ {job.value.map((entry) => entry.jobTime * entry.user.hourlyRate).reduce((previous, current) => previous + current, 0)}</td>
                  <td>{job.value.map((entry) => entry.jobTime).reduce((previous, current) => previous + current, 0)}</td>
                </tr>
              </tfoot>
            </Table>
          </div>
        ))}
      {timesheets.sortedByEmployee &&
        timesheets.sortedByEmployee.map((user) => (
          <>
            <h2>
              {user.value[0].user.firstName} {user.value[0].user.lastName}
            </h2>
            <Table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Total Time</th>
                </tr>
              </thead>
              <tbody>
                {user.value.map((entry) => (
                  <tr key={entry._id}>
                    <td>{entry.day}</td>
                    <td>{entry.startTime}</td>
                    <td>{entry.endTime}</td>
                    <td>{entry.jobTime}</td>
                  </tr>
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
          </>
        ))}
    </>
  );
};

export default TimeSheetReportScreen;
