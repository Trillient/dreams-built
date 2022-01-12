import { Table, Button } from 'react-bootstrap';

import Calendar from '../../components/Calendar';

import styles from './scheduleScreen.module.css';

import CustomMenu from '../../components/CustomMenu';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch, useSelector } from 'react-redux';
import { getDueDates, getJobPartsList } from '../../actions/jobActions';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { DateTime } from 'luxon';

const ScheduleScreen = () => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const jobPartsList = useSelector((state) => state.jobParts);
  const { loading, error, jobParts } = jobPartsList;

  const dueDateList = useSelector((state) => state.dueDateList);
  const { dueDateLoading, dueDateError, dueDates } = dueDateList;

  const startWeekInit = DateTime.now().startOf('week');
  const endWeekInit = DateTime.now().endOf('week').plus({ days: 1 });

  const [weekStart] = useState(startWeekInit.toFormat('yyyy/MM/dd'));
  const [weekEnd] = useState(endWeekInit.toFormat('yyyy/MM/dd'));

  let weekArray = [];
  for (let i = 0; i < 7; i++) {
    weekArray.push({
      day: DateTime.fromFormat(weekStart, 'yyyy/MM/dd').plus({ days: i }).toFormat('EEEE'),
      date: DateTime.fromFormat(weekStart, 'yyyy/MM/dd').plus({ days: i }).toFormat('yyyy-MM-dd'),
      shortDate: DateTime.fromFormat(weekStart, 'yyyy/MM/dd').plus({ days: i }).toFormat('d MMM'),
    });
  }

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently();
        dispatch(getJobPartsList(token));
        dispatch(getDueDates(token, weekStart, weekEnd));
      } catch (err) {
        toast.error(err);
      }
    })();
  }, [dispatch, getAccessTokenSilently, weekEnd, weekStart]);

  return loading || dueDateLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : dueDateError ? (
    <Message variant="danger">{dueDateError}</Message>
  ) : (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <CustomMenu className={styles.search} />
        <p>Pagination</p>
        <Button className={styles.button}>+</Button>
      </div>
      <Table responsive bordered className={styles.table}>
        <thead>
          <tr>
            <th className={styles['first-coloumn']}>#</th>
            {weekArray.map((day) => (
              <th key={day.date} className={styles['static-table']}>
                {day.day} <br />
                {day.shortDate}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jobParts.map((jobPart) => (
            <Calendar key={jobPart._id} jobPart={jobPart} week={weekArray} dueDates={dueDates} loading={loading} dueDateLoading={dueDateLoading} />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ScheduleScreen;
