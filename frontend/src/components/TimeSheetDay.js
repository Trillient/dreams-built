import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Table } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

import { createEntry, deleteEntry } from '../actions/timeSheetActions';
import TimeSheetEntry from './TimeSheetEntry';

const TimeSheetDay = ({ day, date }) => {
  const dispatch = useDispatch();

  const [inputList, setInputList] = useState([]);

  const timeSheetEntries = useSelector((state) => state.timeSheet);
  const { dayEntries } = timeSheetEntries;

  useEffect(() => {
    setInputList(dayEntries.filter((e) => e.day === day));
  }, [dayEntries, day]);

  const onAddBtnClick = () => {
    const entryId = uuidv4();
    dispatch(createEntry(entryId, day));
  };
  const onDeleteClick = (entryId) => {
    dispatch(deleteEntry(entryId));
  };
  const dailyTotal = inputList.filter(({ jobTime }) => jobTime).reduce((total, jobTime) => total + parseFloat(jobTime.jobTime), 0);

  return (
    <Card className="mt-5 mb-5 shadow">
      <Card.Body>
        <h2 className="text-center mb-4">
          {day} - {date}
        </h2>

        {inputList.length === 0 ? (
          []
        ) : (
          <Table striped bordered hover responsive className="table-sm timesheet-grid-container">
            <thead className="display-none_mobile">
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
                <tr className="timesheet-grid" key={entryId}>
                  <TimeSheetEntry entryId={entryId} day={day} />
                  <td>
                    <Button className="btn-main" onClick={() => onDeleteClick(entryId)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <th colSpan="3" className="right-align">
                  Total
                </th>
                <td className="right-align">{dailyTotal.toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        )}

        <Button className="btn-add" onClick={() => onAddBtnClick()}>
          +
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TimeSheetDay;
