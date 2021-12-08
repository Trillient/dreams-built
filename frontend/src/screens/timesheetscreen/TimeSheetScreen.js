import { useEffect, useState } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { DateTime } from 'luxon';

import { getTimeSheet, handleSubmit } from '../../actions/timeSheetActions';
import TimeSheetDay from '../../components/TimeSheetDay';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import CustomMenu from '../../components/CustomMenu';

import 'react-toastify/dist/ReactToastify.css';
import './timesheet.css';

const TimeSheetScreen = () => {
  const startWeekInit = DateTime.now().startOf('week');
  const endWeekInit = DateTime.now().endOf('week');

  const [dropdownTitle, setDropdownTitle] = useState('');
  const [weekStart, setWeekStart] = useState(startWeekInit.toFormat('dd/MM/yyyy'));
  const [endDate, setEndDate] = useState(endWeekInit.toFormat('dd/MM/yyyy'));

  const { getAccessTokenSilently, user } = useAuth0();

  const dispatch = useDispatch();

  const timeSheetEntries = useSelector((state) => state.timeSheet);
  const { loading, error, dayEntries } = timeSheetEntries;

  const weekArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    let token;
    const getToken = async () => {
      token = await getAccessTokenSilently();
    };
    getToken().then(() => dispatch(getTimeSheet(token, user.sub, weekStart)));
  }, [dispatch, getAccessTokenSilently, user, weekStart]);

  const submitHandler = async (event) => {
    event.preventDefault();
    const token = await getAccessTokenSilently();
    dispatch(handleSubmit(dayEntries, weekStart, endDate, token, user.sub));
  };

  let timeSheetPeriods = [{ weekStart: startWeekInit.toFormat('dd/MM/yyyy'), endDate: endWeekInit.toFormat('dd/MM/yyyy') }];
  for (let i = 1; i < 5; i++) {
    timeSheetPeriods.push({ weekStart: startWeekInit.minus({ days: i * 7 }).toFormat('dd/MM/yyyy'), endDate: endWeekInit.minus({ days: i * 7 }).toFormat('dd/MM/yyyy') });
  }

  const title = !dropdownTitle ? `${weekStart} - ${endDate}` : `${dropdownTitle.weekStart} - ${dropdownTitle.endDate}`;

  const weekSelect = (date) => {
    setDropdownTitle(date);
    setWeekStart(date.weekStart);
    setEndDate(date.endDate);
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
            <div className="grid-2">
              <Dropdown>
                <Dropdown.Toggle id="dropdown-button" variant="secondary">
                  Week: {title}
                </Dropdown.Toggle>

                <Dropdown.Menu as={CustomMenu}>
                  {timeSheetPeriods.map((date) => (
                    <Dropdown.Item eventKey={date.endDate} key={date.weekStart} onClick={() => weekSelect(date)}>
                      {date.weekStart} - {date.endDate}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Button variant="primary" type="submit" className="btn-time-save">
                Save
              </Button>
            </div>
            {weekArray.map((day) => (
              <TimeSheetDay key={day} day={day} />
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
