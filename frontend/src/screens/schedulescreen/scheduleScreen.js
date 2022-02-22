import { useEffect, useRef, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-date-picker';
import { DateTime } from 'luxon';
import Select from 'react-select';
import ReactToPrint from 'react-to-print';
import { BsFillPrinterFill, BsFillCalendarFill, BsArrowLeft, BsArrowRight } from 'react-icons/bs';

import { getDueDates, getJobList, getJobPartsList, resetDueDateUpdate } from '../../actions/jobActions';

import Calendar from '../../components/Calendar';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { ScheduleCreateJobsDueDate } from '../../components/modals/ScheduleCreateJobsDueDate';

import styles from './scheduleScreen.module.css';
import { ToastContainer } from 'react-toastify';
import { getContractors } from '../../actions/contractorActions';

const ScheduleScreen = () => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const componentRef = useRef();

  const jobPartsList = useSelector((state) => state.jobParts);
  const { loading, error, jobParts } = jobPartsList;

  const dueDateList = useSelector((state) => state.dueDateList);
  const { dueDateLoading, dueDateError, dueDates } = dueDateList;

  const dueDateUpdates = useSelector((state) => state.jobDueDates);
  const { dueDateUpdated } = dueDateUpdates;

  const contractorsList = useSelector((state) => state.contractors);
  const { contractorList } = contractorsList;

  const startWeekInit = DateTime.now().startOf('week');
  const endWeekInit = DateTime.now().endOf('week').plus({ days: 1 });

  const [modalShow, setModalShow] = useState(false);
  const [weekStart, setWeekStart] = useState(startWeekInit.toFormat('yyyy-MM-dd'));
  const [weekEnd, setWeekEnd] = useState(endWeekInit.toFormat('yyyy-MM-dd'));
  const [filterContractor, setFilterContractor] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  let weekArray = [];
  for (let i = 0; i < 7; i++) {
    weekArray.push({
      day: DateTime.fromFormat(weekStart, 'yyyy-MM-dd').plus({ days: i }).toFormat('EEEE'),
      date: DateTime.fromFormat(weekStart, 'yyyy-MM-dd').plus({ days: i }).toFormat('yyyy-MM-dd'),
      isoDate: new Date(DateTime.fromFormat(weekStart, 'yyyy-MM-dd').plus({ days: i }).toISODate()).toISOString(),
      shortDate: DateTime.fromFormat(weekStart, 'yyyy-MM-dd').plus({ days: i }).toFormat('d MMM'),
    });
  }

  useEffect(() => {
    if (dueDateUpdated) {
      dispatch(resetDueDateUpdate());
    } else {
      (async () => {
        try {
          const token = await getAccessTokenSilently();
          dispatch(getDueDates(token, weekStart, weekEnd));
          dispatch(getJobPartsList(token));
          dispatch(getContractors(token));
          dispatch(getJobList(token));
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [dispatch, getAccessTokenSilently, weekEnd, weekStart, dueDateUpdated]);

  const changeDateHandler = (e) => {
    setSelectedDate(e);
    setWeekStart(DateTime.fromJSDate(e).startOf('week').toFormat('yyyy-MM-dd'));
    setWeekEnd(DateTime.fromJSDate(e).endOf('week').plus({ days: 1 }).toFormat('yyyy-MM-dd'));
  };

  const changeDateWeekHandler = (e) => {
    if (e === 1) {
      setSelectedDate(DateTime.fromJSDate(selectedDate).plus({ days: 7 }).toJSDate());
      setWeekStart(DateTime.fromJSDate(selectedDate).plus({ days: 7 }).startOf('week').toFormat('yyyy-MM-dd'));
      setWeekEnd(DateTime.fromJSDate(selectedDate).plus({ days: 7 }).endOf('week').plus({ days: 1 }).toFormat('yyyy-MM-dd'));
    } else {
      setSelectedDate(DateTime.fromJSDate(selectedDate).minus({ days: 7 }).toJSDate());
      setWeekStart(DateTime.fromJSDate(selectedDate).minus({ days: 7 }).startOf('week').toFormat('yyyy-MM-dd'));
      setWeekEnd(DateTime.fromJSDate(selectedDate).minus({ days: 7 }).endOf('week').plus({ days: 1 }).toFormat('yyyy-MM-dd'));
    }
  };

  return error ? (
    <Message variant="danger">{error}</Message>
  ) : dueDateError ? (
    <Message variant="danger">{dueDateError}</Message>
  ) : (
    <div className={styles.calendar}>
      <ToastContainer theme="colored" />
      <div className={styles.header}>
        <div className={styles.filter}>
          <Select
            className={styles.select}
            menuPosition={'fixed'}
            isClearable="true"
            placeholder="Filter by Contractor..."
            isMulti
            closeMenuOnSelect="false"
            onChange={setFilterContractor}
            options={
              contractorList &&
              contractorList.map((contractor) => {
                return { ...contractor, label: contractor.contractor, value: contractor._id };
              })
            }
          />
        </div>
        <div className={styles.pagination}>
          <Button
            className={styles['btn-pag']}
            onClick={() => {
              changeDateWeekHandler(0);
            }}
          >
            <BsArrowLeft />
          </Button>
          <DatePicker calendarClassName={styles['date-calendar']} className={styles['date-picker']} calendarIcon={<BsFillCalendarFill />} clearIcon={null} onChange={changeDateHandler} value={selectedDate} />
          <Button
            className={styles['btn-pag']}
            onClick={() => {
              changeDateWeekHandler(1);
            }}
          >
            <BsArrowRight />
          </Button>
        </div>
        <div className={styles.add}>
          <Button onClick={setModalShow}>+</Button>
        </div>
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
        <h1 className={`${styles.mobile} ${styles.month}`}>{DateTime.fromFormat(weekStart, 'yyyy-MM-dd').toFormat('MMMM')}</h1>
        <Table responsive="sm" bordered className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles['first-coloumn']}></th>
              {weekArray.map((day) => (
                <th key={day.date} className={styles['static-table']}>
                  <div className={styles.mobile}>
                    {day.day[0]} <br />
                    {day.shortDate.slice(0, 2)}
                  </div>
                  <div className={styles.desktop}>
                    {day.day} <br />
                    {day.shortDate}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobParts.map((jobPart) => (
              <Calendar key={jobPart._id} jobPart={jobPart} week={weekArray} dueDates={dueDates} loading={loading} filterContractor={filterContractor} dueDateLoading={dueDateLoading} />
            ))}
          </tbody>
        </Table>
      </div>
      <ScheduleCreateJobsDueDate show={modalShow} setModalShow={setModalShow} onHide={() => setModalShow(false)} />
    </div>
  );
};

export default withAuthenticationRequired(ScheduleScreen, {
  onRedirecting: () => <Loader />,
});
