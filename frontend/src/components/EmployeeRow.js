import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';

import TimesheetEntryModal from './modals/TimesheetEntryModal';

import styles from './employeeReportCard.module.css';

const EmployeeRow = ({ entry }) => {
  const [modalShow, setModalShow] = useState(false);
  return (
    <>
      <tr>
        <td>{entry.day}</td>
        <td className={styles.time}>{entry.startTime}</td>
        <td className={styles.time}>{entry.endTime}</td>
        <td className={styles.job}>
          {entry?.job?.jobNumber}
          <span className={styles.address}> - {entry?.job?.address}</span>
          <span className={styles.city}> - {entry?.job?.city}</span>
        </td>
        <td>{entry.jobTime}</td>
        <td className={styles.edit}>
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
