import { useAuth0 } from '@auth0/auth0-react';
import { DateTime } from 'luxon';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-date-picker';
import { BsFillPrinterFill, BsFillCalendarFill, BsArrowLeft, BsArrowRight } from 'react-icons/bs';

import { getEmployeeTimeSheets, getEmployeeTimeSheetsNotEntered } from '../../actions/reportActions';

import EmployeeReportCard from '../../components/EmployeeReportCard';
import Message from '../../components/Message';
import ReportNoteEnteredModal from '../../components/modals/ReportNoteEnteredModal';

import styles from './timesheetReports.module.css';
import ReactToPrint from 'react-to-print';

const TimesheetUserReportScreen = () => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const componentRef = useRef();

  const timesheetList = useSelector((state) => state.reports);
  const { error, timesheets } = timesheetList;

  const dbDateFormat = 'dd/MM/yyyy';
  const startWeekInit = DateTime.now().startOf('week');

  const [modalShow, setModalShow] = useState(false);
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

  const getNotEnteredUsers = async () => {
    const token = await getAccessTokenSilently();
    dispatch(getEmployeeTimeSheetsNotEntered(token, weekStart.db));
    setModalShow(true);
  };

  return error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <section className="container">
      <div className={styles.page}>
        <h1 style={{ textAlign: 'center' }}>Timesheets</h1>
        <Button onClick={getNotEnteredUsers}>Not Entered</Button>
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
          <ReactToPrint
            trigger={() => (
              <button className={styles.printer}>
                <BsFillPrinterFill />
              </button>
            )}
            content={() => componentRef.current}
          />
        </div>
        <div ref={componentRef}>
          {timesheets.sortedByEmployee &&
            timesheets.sortedByEmployee.map((employee) => (
              <div key={employee.userId}>
                <div className="page-break" />
                <div className={styles.card}>
                  <EmployeeReportCard employee={employee} />
                </div>
              </div>
            ))}
        </div>
      </div>
      <ReportNoteEnteredModal show={modalShow} setModalShow={setModalShow} onHide={() => setModalShow(false)} />
    </section>
  );
};

export default TimesheetUserReportScreen;
