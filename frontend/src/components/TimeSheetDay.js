import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { createEntry, deleteEntry } from '../actions/timeSheetActions';
import { Button, Card } from 'react-bootstrap';
import TimeSheetEntry from './TimeSheetEntry';
import { FaTrash } from 'react-icons/fa';

const TimeSheetDay = ({ day }) => {
  const dispatch = useDispatch();

  const [inputList, setInputList] = useState([]);

  const onAddBtnClick = () => {
    const id = uuidv4();
    setInputList([...inputList, { id: id }]);
    dispatch(createEntry(id, day));
  };
  const onDeleteClick = (id) => {
    // if (window.confirm('Are you sure')) {
    setInputList(inputList.filter((e) => e.id !== id));
    dispatch(deleteEntry(id));
    // }
  };

  return (
    <Card className="mt-5 mb-5 shadow">
      <Card.Body>
        <h2 className="text-center mb-4">{day}</h2>
        {inputList.map(({ id }, index) => (
          <div className="m-2 timesheet-grid-container" key={id}>
            <Card>
              <TimeSheetEntry id={id} index={index} day={day} setInputList={setInputList} inputList={inputList} />
            </Card>
            <Button className="btn-main" id={id} onClick={() => onDeleteClick(id)}>
              <FaTrash />
            </Button>
          </div>
        ))}

        <Button className="btn-add" onClick={() => onAddBtnClick()}>
          +
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TimeSheetDay;

// TODO - Replace inputList with redux state, CHECK entries in DAY array and display

// TODO - store day entries in LOCAL STORAGE until form submit
