import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import TimeSheetEntry from "./TimeSheetEntry";

const TimeSheetDay = ({ day }) => {
  const [inputList, setInputList] = useState([]);

  const onAddBtnClick = () => {
    setInputList([...inputList, { id: inputList.length }]);
    console.log(inputList);
  };
  const onDeleteClick = (id) => {
    setInputList(inputList.filter((e) => e.id !== id));
  };

  return (
    <Card className="mt-5 mb-5">
      <Card.Body>
        <h2>{day}</h2>
        <TimeSheetEntry />

        {inputList.map(({ id }) => {
          return (
            <div key={id}>
              <TimeSheetEntry id={id} />
              <Button id={id} onClick={() => onDeleteClick(id)}>
                -
              </Button>
            </div>
          );
        })}

        <Button onClick={onAddBtnClick}>+</Button>
      </Card.Body>
    </Card>
  );
};

export default TimeSheetDay;
