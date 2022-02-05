import { useEffect, useState } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { DateTime } from 'luxon';

import { getTimesheet, handleSubmit } from '../../actions/timesheetActions';
import { getJobList } from '../../actions/jobActions';

import TimesheetDay from '../../components/TimesheetDay';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import CustomMenu from '../../components/CustomMenu';

import styles from './timesheet.module.css';
import { getEmployees } from '../../actions/employeeActions';
import Select from 'react-select';

const TimesheetScreen = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const domain = process.env.REACT_APP_CUSTOM_DOMAIN;

  const dispatch = useDispatch();

  const timesheetEntries = useSelector((state) => state.timesheet);
  const { loading, error, dayEntries, comments } = timesheetEntries;
  const employeeList = useSelector((state) => state.employees);

  const startWeekInit = DateTime.now().startOf('week');
  const weekEndInit = DateTime.now().endOf('week');

  const [weekStart, setWeekStart] = useState(startWeekInit.toFormat('dd/MM/yyyy'));
  const [weekEnd, setWeekEnd] = useState(weekEndInit.toFormat('dd/MM/yyyy'));
  const [selectedUser, setSelectedUser] = useState({ label: user.given_name, value: user.sub });

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
    const dateFormat = DateTime.fromFormat(weekStart, 'dd/MM/yyyy').plus({ days: i });
    const day = dateFormat.toFormat('d');

    weekArray = [
      ...weekArray,
      {
        day: dateFormat.toFormat('EEEE'),
        date: day,
        ordinal: ordinal(day),
        month: dateFormat.toFormat('MMMM'),
      },
    ];
  }

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently();
        dispatch(getJobList(token));
        if (user[`${domain}/roles`].includes('Admin')) {
          dispatch(getEmployees(token));
          dispatch(getTimesheet(token, selectedUser.value, weekStart));
        } else {
          dispatch(getTimesheet(token, user.sub, weekStart));
        }
      } catch (error) {
        console.error(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, getAccessTokenSilently, user, weekStart, selectedUser]);

  const submitHandler = async (event) => {
    event.preventDefault();
    const token = await getAccessTokenSilently();
    user[`${domain}/roles`].includes('Admin') ? dispatch(handleSubmit(dayEntries, weekStart, weekEnd, token, selectedUser.value, comments)) : dispatch(handleSubmit(dayEntries, weekStart, weekEnd, token, user.sub, comments));
  };

  return (
    <div className="parent-container">
      <ToastContainer theme="colored" />
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={submitHandler} className="container">
          {user[`${domain}/roles`].includes('Admin') ? (
            <div className={styles.users}>
              <Select
                menuPosition={'fixed'}
                isClearable="true"
                defaultValue={selectedUser}
                onChange={setSelectedUser}
                options={
                  employeeList.employeeList &&
                  employeeList.employeeList.map((option) => {
                    return { label: `${option.firstName} ${option.lastName}`, value: option.userId };
                  })
                }
              />
            </div>
          ) : null}
          <div className={styles['grid-card-top']}>
            <Dropdown>
              <Dropdown.Toggle id="dropdown-button" variant="primary">
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
            <TimesheetDay key={day.date} day={day.day} date={day.date} ordinal={day.ordinal} month={day.month} />
          ))}
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Form>
      )}
    </div>
  );
};

export default withAuthenticationRequired(TimesheetScreen, {
  onRedirecting: () => <Loader />,
});
