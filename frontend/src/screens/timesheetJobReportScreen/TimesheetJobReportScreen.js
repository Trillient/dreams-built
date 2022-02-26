import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { BsFillCalendarFill, BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import DatePicker from 'react-date-picker';

import { getEmployeeTimeSheets } from '../../actions/reportActions';

import Loader from '../../components/Loader';
import Message from '../../components/Message';
import JobReportCard from '../../components/JobReportCard';

import styles from './timesheetJobReportScreen.module.css';

const TimesheetJobReportScreen = () => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const timesheetList = useSelector((state) => state.reports);
  const { loading, error, timesheets } = timesheetList;

  const dbDateFormat = 'dd/MM/yyyy';
  const startWeekInit = DateTime.now().startOf('week');

  const [weekStart, setWeekStart] = useState({ calendar: startWeekInit.toJSDate(), db: startWeekInit.toFormat(dbDateFormat) });

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently();
        dispatch(getEmployeeTimeSheets(token, weekStart.db));
      } catch (err) {
        console.error(err);
      }
    })();
  }, [dispatch, getAccessTokenSilently, weekStart.db]);

  const changeDateHandler = (e) => {
    const date = DateTime.fromJSDate(e).startOf('week');
    setWeekStart({ calendar: date.toJSDate(), db: date.toFormat(dbDateFormat) });
  };

  const changeDateWeekHandler = (e) => {
    const date = DateTime.fromJSDate(weekStart.calendar);
    if (e === 1) {
      const advancedDate = date.plus({ days: 7 }).startOf('week');
      setWeekStart({ calendar: advancedDate.toJSDate(), db: advancedDate.toFormat(dbDateFormat) });
    } else {
      const retreatedDate = date.minus({ days: 7 }).startOf('week');
      setWeekStart({ calendar: retreatedDate.toJSDate(), db: retreatedDate.toFormat(dbDateFormat) });
    }
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <section className="container">
      <div className={styles.page}>
        <h1 style={{ textAlign: 'center' }}>Labour Expenses</h1>
        <div className={styles.pagination}>
          <Button
            className={styles['btn-pag']}
            onClick={() => {
              changeDateWeekHandler(0);
            }}
          >
            <BsArrowLeft />
          </Button>
          <DatePicker calendarIcon={<BsFillCalendarFill />} onChange={changeDateHandler} clearIcon={null} value={weekStart.calendar} />
          <Button
            className={styles['btn-pag']}
            onClick={() => {
              changeDateWeekHandler(1);
            }}
          >
            <BsArrowRight />
          </Button>
        </div>

        {timesheets.sortedByEmployee && timesheets.sortedByJob.map((job) => <JobReportCard key={job.jobNumber} job={job} />)}
      </div>
    </section>
  );
};

export default withAuthenticationRequired(TimesheetJobReportScreen, {
  onRedirecting: () => <Loader />,
});
