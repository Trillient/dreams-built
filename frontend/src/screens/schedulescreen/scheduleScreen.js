import { Table, Button } from 'react-bootstrap';

import Calendar from '../../components/Calendar';

import styles from './scheduleScreen.module.css';

import CustomMenu from '../../components/CustomMenu';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch, useSelector } from 'react-redux';
import { getJobPartsList } from '../../actions/jobActions';
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

  const startWeekInit = DateTime.now().startOf('week');

  const [weekStart] = useState(startWeekInit.toFormat('dd/MM/yyyy'));

  let weekArray = [];
  for (let i = 0; i < 7; i++) {
    weekArray.push({ day: DateTime.fromFormat(weekStart, 'dd/MM/yyyy').plus({ days: i }).toFormat('EEEE'), date: DateTime.fromFormat(weekStart, 'dd/MM/yyyy').plus({ days: i }).toFormat('d MMM') });
  }

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently();
        dispatch(getJobPartsList(token));
      } catch (err) {
        toast.error(err);
      }
    })();
  }, [dispatch, getAccessTokenSilently]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
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
                {day.date}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jobParts.map((jobPart) => (
            <Calendar key={jobPart._id} jobPart={jobPart.jobPartTitle} week={weekArray} jobData={jobParts} />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ScheduleScreen;
