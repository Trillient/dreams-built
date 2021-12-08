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
  const [dropdownTitle, setDropdownTitle] = useState('');

  const { getAccessTokenSilently, user } = useAuth0();

  const dispatch = useDispatch();

  const timeSheetEntries = useSelector((state) => state.timeSheet);
  const { loading, error, dayEntries } = timeSheetEntries;

  const startWeekInit = DateTime.now().startOf('week');
  const endWeekInit = DateTime.now().endOf('week');

  const weekStart = startWeekInit.toFormat('dd/MM/yyyy');
  const endDate = endWeekInit.toFormat('dd/MM/yyyy');

  const weekArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // TODO create a use state for weekStart that is the fetched date OR the created weekStart-- how to get back to current week if not filled out?

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

  // TODO - create an array that searches the last 4 weeks, then onClick will create a get request
  let dummyArray = [{ weekStart: weekStart, endDate: endDate }];
  for (let i = 1; i < 5; i++) {
    dummyArray.push({ weekStart: startWeekInit.minus({ days: i * 7 }).toFormat('dd/MM/yyyy'), endDate: endWeekInit.minus({ days: i * 7 }).toFormat('dd/MM/yyyy') });
  }

  const title = !dropdownTitle ? `${weekStart} - ${endDate}` : `${dropdownTitle.weekStart} - ${dropdownTitle.endDate}`;

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
                  {dummyArray.map((date) => (
                    <Dropdown.Item eventKey={date.endDate} key={date.weekStart} onClick={() => setDropdownTitle(date)}>
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
