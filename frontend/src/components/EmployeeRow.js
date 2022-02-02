import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';
import TimesheetEntryModal from './modals/TimesheetEntryModal';

const EmployeeRow = ({ entry }) => {
  const [modalShow, setModalShow] = useState(false);
  return (
    <>
      <tr>
        <td>{entry.day}</td>
        <td>{entry.startTime}</td>
        <td>{entry.endTime}</td>
        <td>{entry.jobTime}</td>
        <td>
          <Button className="btn-sm" onClick={() => setModalShow(true)}>
            <FiEdit />
          </Button>
        </td>
      </tr>
      <TimesheetEntryModal show={modalShow} entry={entry} setModalShow={setModalShow} onHide={() => setModalShow(false)} />
    </>
  );
};

export default EmployeeRow;
