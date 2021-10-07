import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
// import { useDispatch } from 'react-redux';
// import { deleteTimeSheetEntry } from '../actions/timeSheetActions';
import { Button, Card } from 'react-bootstrap';
import TimeSheetEntry from './TimeSheetEntry';
import { FaTrash } from 'react-icons/fa';

const TimeSheetDay = ({ day }) => {
  // const dispatch = useDispatch();
  const [inputList, setInputList] = useState([]);

  const onAddBtnClick = () => {
    setInputList([...inputList, { id: uuidv4() }]);
  };
  const onDeleteClick = (id) => {
    // if (window.confirm('Are you sure')) {
    // dispatch(deleteTimeSheetEntry(id));
    setInputList(inputList.filter((e) => e.id !== id));
    // }
  };
  console.log(inputList);
  return (
    <Card className="mt-5 mb-5 shadow">
      <Card.Body>
        <h2 className="text-center mb-4">{day}</h2>
        {inputList.map(({ id }, index) => (
          <div className="m-2 timesheet-grid-container" key={id}>
            <Card>
              <TimeSheetEntry name={id} index={index} />
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

// TODO - onClick ADD - create new entry in DAY array

// TODO - onClick DELETE - DELETE entry in DAY array

// TODO - store day entries in LOCAL STORAGE until form submit
