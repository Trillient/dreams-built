import { useEffect, useState } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { DateTime } from 'luxon';

import { getTimeSheet, handleSubmit } from '../../actions/timeSheetActions';
import { getJobList } from '../../actions/jobActions';
import TimeSheetDay from '../../components/TimeSheetDay';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import CustomMenu from '../../components/CustomMenu';

import 'react-toastify/dist/ReactToastify.css';
import styles from './timesheet.module.css';

const TimeSheetScreen = () => {
  const { getAccessTokenSilently, user } = useAuth0();

  const dispatch = useDispatch();
  const timeSheetEntries = useSelector((state) => state.timeSheet);
  const { loading, error, dayEntries } = timeSheetEntries;

  const jobsList = useSelector((state) => state.jobsList);
  const { jobList } = jobsList;

  const startWeekInit = DateTime.now().startOf('week');
  const endWeekInit = DateTime.now().endOf('week');

  const [weekStart, setWeekStart] = useState(startWeekInit.toFormat('dd/MM/yyyy'));
  const [endDate, setEndDate] = useState(endWeekInit.toFormat('dd/MM/yyyy'));

  let timeSheetPeriods = [{ weekStart: startWeekInit.toFormat('dd/MM/yyyy'), endDate: endWeekInit.toFormat('dd/MM/yyyy') }];
  for (let i = 1; i < 5; i++) {
    timeSheetPeriods.push({ weekStart: startWeekInit.minus({ days: i * 7 }).toFormat('dd/MM/yyyy'), endDate: endWeekInit.minus({ days: i * 7 }).toFormat('dd/MM/yyyy') });
  }

  let weekArray = [];
  for (let i = 0; i < 7; i++) {
    weekArray.push({ day: DateTime.fromFormat(weekStart, 'dd/MM/yyyy').plus({ days: i }).toFormat('EEEE'), date: DateTime.fromFormat(weekStart, 'dd/MM/yyyy').plus({ days: i }).toFormat('d MMMM') });
  }

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently();
        if (jobList.length < 1) {
          dispatch(getJobList(token));
        }
        dispatch(getTimeSheet(token, user.sub, weekStart));
      } catch (error) {
        console.error(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, getAccessTokenSilently, user, weekStart]);

  const submitHandler = async (event) => {
    event.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(handleSubmit(dayEntries, weekStart, endDate, token, user.sub));
  };

  return (
    <>
      <ToastContainer theme="colored" />
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="background">
          <Form onSubmit={submitHandler}>
            <div className={styles['grid-2']}>
              <Dropdown>
                <Dropdown.Toggle id="dropdown-button" variant="secondary">
                  Week: {weekStart} - {endDate}
                </Dropdown.Toggle>

                <Dropdown.Menu as={CustomMenu}>
                  {timeSheetPeriods.map((date) => (
                    <Dropdown.Item
                      eventKey={date.endDate}
                      key={date.weekStart}
                      onClick={() => {
                        setWeekStart(date.weekStart);
                        setEndDate(date.endDate);
                      }}
                    >
                      {date.weekStart} - {date.endDate}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Button variant="primary" type="submit" className={styles['btn-time-save']}>
                Save
              </Button>
            </div>
            {weekArray.map((day) => (
              <TimeSheetDay key={day.date} day={day.day} date={day.date} />
            ))}
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </div>
      )}
    </>
  );
};

export default withAuthenticationRequired(TimeSheetScreen, {
  onRedirecting: () => <Loader />,
});
