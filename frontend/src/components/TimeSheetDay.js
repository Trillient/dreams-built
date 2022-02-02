import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Table } from 'react-bootstrap';
import { FaTrash, FaCommentDots } from 'react-icons/fa';

import { createEntry, deleteEntry } from '../actions/timesheetActions';
import TimesheetEntry from './TimesheetEntry';

import styles from '../screens/timesheetScreen/timesheet.module.css';
import TimesheetCommentModal from './modals/TimesheetCommentModal';

const TimesheetDay = ({ day, date, ordinal, month }) => {
  const dispatch = useDispatch();

  const [inputList, setInputList] = useState([]);
  const [modalShow, setModalShow] = useState(false);

  const timesheetEntries = useSelector((state) => state.timesheet);
  const { dayEntries, comments } = timesheetEntries;

  useEffect(() => {
    setInputList(dayEntries.filter((entry) => entry.day === day));
  }, [dayEntries, day]);

  const onAddBtnClick = () => {
    const entryId = uuidv4();
    dispatch(createEntry(entryId, day));
  };
  const onDeleteClick = (entryId) => {
    dispatch(deleteEntry(entryId));
  };
  const dailyTotal = inputList.filter(({ jobTime }) => jobTime).reduce((total, jobTime) => total + parseFloat(jobTime.jobTime), 0);
  const commentExists = comments.filter((comment) => comment.day === day && comment.comments !== '').length > 0;

  return (
    <Card className="mt-3 mb-3 shadow">
      <Card.Header>
        <div className={styles.header}>
          <div className={styles.block}>
            <Button variant={commentExists ? 'success' : 'primary'} onClick={() => setModalShow(true)}>
              <FaCommentDots />
            </Button>
          </div>
          <h2 className={styles.title}>
            {day} - {date}
            <sup>{ordinal}</sup> {month}
          </h2>
          <Button className={styles.controls} onClick={() => onAddBtnClick()}>
            +
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {inputList.length > 0 && (
          <Table hover bordered responsive className={styles['timesheet-grid-container']}>
            <thead className="display-none_mobile table-dark">
              <tr>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Job Number</th>
                <th>
                  <em>Hrs</em>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {inputList.map(({ entryId }) => (
                <tr className={styles['timesheet-grid']} key={entryId}>
                  <TimesheetEntry entryId={entryId} day={day} />
                  <td className={styles['table-coloumn-delete']}>
                    <Button variant="danger" className="btn-main" onClick={() => onDeleteClick(entryId)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="display-none_mobile">
              <tr>
                <th colSpan="3" className="right-align">
                  Total
                </th>
                <td className="right-align">{dailyTotal.toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </Table>
        )}
        <Button className={styles['btn-sml-screen-btm']} onClick={() => onAddBtnClick()}>
          +
        </Button>
      </Card.Body>
      <TimesheetCommentModal show={modalShow} day={day} date={date} ordinal={ordinal} month={month} setModalShow={setModalShow} onHide={() => setModalShow(false)} />
    </Card>
  );
};

export default TimesheetDay;
