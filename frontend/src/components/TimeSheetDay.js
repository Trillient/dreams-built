import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { createEntry, deleteEntry } from '../actions/timeSheetActions';
import { Button, Card, Table } from 'react-bootstrap';
import TimeSheetEntry from './TimeSheetEntry';
import { FaTrash } from 'react-icons/fa';

const TimeSheetDay = ({ day }) => {
  const dispatch = useDispatch();

  const [inputList, setInputList] = useState([]);
  const timeSheetEntries = useSelector((state) => state.timeSheet);
  const { dayEntries } = timeSheetEntries;

  useEffect(() => {
    setInputList(dayEntries.filter((e) => e.day === day));
  }, [dayEntries, day]);

  const onAddBtnClick = () => {
    const id = uuidv4();
    dispatch(createEntry(id, day));
  };
  const onDeleteClick = (id) => {
    // if (window.confirm('Are you sure')) {
    dispatch(deleteEntry(id));
    // }
  };

  return (
    <Card className="mt-5 mb-5 shadow">
      <Card.Body>
        <h2 className="text-center mb-4">{day}</h2>
        <Table striped bordered hover responsive className="table-sm timesheet-grid-container">
          <thead className="display-none_mobile">
            {inputList.length === 0 ? (
              []
            ) : (
              <tr>
                <th></th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Job Number</th>
                <th>
                  <em>Hrs</em>
                </th>
                <th></th>
              </tr>
            )}
          </thead>
          <tbody>
            {inputList.map(({ id }, index) => (
              <tr className="timesheet-grid" key={id}>
                <td className="display-none_mobile">{index + 1}</td>
                <TimeSheetEntry id={id} index={index} day={day} setInputList={setInputList} inputList={inputList} />
                <td>
                  <Button className="btn-main" id={id} onClick={() => onDeleteClick(id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button className="btn-add" onClick={() => onAddBtnClick()}>
          +
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TimeSheetDay;
