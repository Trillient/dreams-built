import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import TimeSheetEntry from "./TimeSheetEntry";

const TimeSheetDay = ({ day }) => {
  const [inputList, setInputList] = useState([<TimeSheetEntry />]);

  const onAddBtnClick = () => {
    setInputList(inputList.concat(<TimeSheetEntry key={inputList.length} />));
  };

  return (
    <Card className="mt-5 mb-5">
      <Card.Body>
        <h2>{day}</h2>
        {inputList}
        <Button onClick={onAddBtnClick}>+</Button>
      </Card.Body>
    </Card>
  );
};

export default TimeSheetDay;
