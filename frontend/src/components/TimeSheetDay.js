import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import TimeSheetEntry from "./TimeSheetEntry";
import { FaTrash } from "react-icons/fa";

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
    <Card className="mt-5 mb-5 shadow">
      <Card.Body>
        <h2 class="text-center mb-4">{day}</h2>
        <Card className="m-2">
          <TimeSheetEntry />
        </Card>
        {inputList.map(({ id }) => {
          return (
            <div className="m-2" key={id}>
              <Card key={id}>
                <TimeSheetEntry id={id} />
              </Card>
              <Button className="btn-main" id={id} onClick={() => onDeleteClick(id)}>
                <FaTrash />
              </Button>
            </div>
          );
        })}

        <Button className="btn-add" onClick={onAddBtnClick}>
          +
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TimeSheetDay;

// TODO - make unique id for inputlist
//  Currently If a user were to add and then delete an entry they will have the same id when this needs to be unique
