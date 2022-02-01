import { useEffect, useState } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { DateTime } from 'luxon';

import { getTimesheet, handleSubmit } from '../../actions/timesheetActions';
import { getJobList } from '../../actions/jobActions';

import TimeSheetDay from '../../components/TimeSheetDay';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import CustomMenu from '../../components/CustomMenu';

import styles from './timesheet.module.css';

const TimesheetScreen = () => {
  const { getAccessTokenSilently, user } = useAuth0();

  const dispatch = useDispatch();

  const timesheetEntries = useSelector((state) => state.timesheet);
  const { loading, error, dayEntries } = timesheetEntries;

  const startWeekInit = DateTime.now().startOf('week');
  const weekEndInit = DateTime.now().endOf('week');

  const [weekStart, setWeekStart] = useState(startWeekInit.toFormat('dd/MM/yyyy'));
  const [weekEnd, setWeekEnd] = useState(weekEndInit.toFormat('dd/MM/yyyy'));

  let timesheetPeriods = [{ weekStart: startWeekInit.toFormat('dd/MM/yyyy'), weekEnd: weekEndInit.toFormat('dd/MM/yyyy') }];
  for (let i = 1; i < 4; i++) {
    timesheetPeriods = [
      ...timesheetPeriods,
      {
        weekStart: startWeekInit.minus({ days: i * 7 }).toFormat('dd/MM/yyyy'),
        weekEnd: weekEndInit.minus({ days: i * 7 }).toFormat('dd/MM/yyyy'),
      },
    ];
  }

  const ordinal = (number) => {
    const superScript = ['th', 'st', 'nd', 'rd'];
    return superScript[(number - 20) % 10] || superScript[number] || superScript[0];
  };

  let weekArray = [];
  for (let i = 0; i < 7; i++) {
    const day = DateTime.fromFormat(weekStart, 'dd/MM/yyyy').plus({ days: i }).toFormat('d');

    weekArray = [
      ...weekArray,
      {
        day: DateTime.fromFormat(weekStart, 'dd/MM/yyyy').plus({ days: i }).toFormat('EEEE'),
        date: day,
        ordinal: ordinal(day),
        month: DateTime.fromFormat(weekStart, 'dd/MM/yyyy').plus({ days: i }).toFormat('MMMM'),
      },
    ];
  }

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently();
        dispatch(getJobList(token));
        dispatch(getTimesheet(token, user.sub, weekStart));
      } catch (error) {
        console.error(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, getAccessTokenSilently, user, weekStart]);

  const submitHandler = async (event) => {
    event.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(handleSubmit(dayEntries, weekStart, weekEnd, token, user.sub));
  };

  return (
    <>
      <ToastContainer theme="colored" />
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={submitHandler} className="container">
          <div className={styles['grid-2']}>
            <Dropdown>
              <Dropdown.Toggle id="dropdown-button" variant="secondary">
                Week: {weekStart} - {weekEnd}
              </Dropdown.Toggle>
              <Dropdown.Menu as={CustomMenu} style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
                {timesheetPeriods.map((date) => (
                  <Dropdown.Item
                    eventKey={date.weekEnd}
                    key={date.weekStart}
                    onClick={() => {
                      setWeekStart(date.weekStart);
                      setWeekEnd(date.weekEnd);
                    }}
                  >
                    {date.weekStart} - {date.weekEnd}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Button variant="primary" type="submit" className={styles['btn-time-save']}>
              Save
            </Button>
          </div>
          {weekArray.map((day) => (
            <TimeSheetDay key={day.date} day={day.day} date={day.date} ordinal={day.ordinal} month={day.month} />
          ))}
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Form>
      )}
    </>
  );
};

export default withAuthenticationRequired(TimesheetScreen, {
  onRedirecting: () => <Loader />,
});
