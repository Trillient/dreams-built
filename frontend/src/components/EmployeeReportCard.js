import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';

import EmployeeRow from './EmployeeRow';

import styles from './employeeReportCard.module.css';

const EmployeeReportCard = ({ employee }) => {
  const [title, setTitle] = useState('');

  const firstName = employee.value[0].user.firstName;
  const lastName = employee.value[0].user.lastName;
  const email = employee.value[0].user.auth0Email;

  useEffect(() => {
    if (firstName && lastName) {
      setTitle(`${firstName} ${lastName}`);
    } else if (firstName) {
      setTitle(firstName);
    } else if (lastName) {
      setTitle(lastName);
    } else if (email) {
      setTitle(email);
    } else {
      setTitle(employee.userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{title}</h2>
      <p className={styles.dates}>
        <strong>
          <em>
            {employee.value[0].weekStart} - {employee.value[0].weekEnd}
          </em>
        </strong>
      </p>
      <Table>
        <thead>
          <tr>
            <th>Day</th>
            <th className={styles.time}>Start Time</th>
            <th className={styles.time}>End Time</th>
            <th className={styles.job}>Job</th>
            <th>Total Time</th>
            <th className={styles.edit}>Edit</th>
          </tr>
        </thead>
        <tbody>
          {employee.value.map((entry) => (
            <EmployeeRow entry={entry} key={entry._id} />
          ))}
        </tbody>
        <tfoot className={styles.footer}>
          <tr>
            <th>Total</th>
            <td className={styles.time}></td>
            <td className={styles.time}></td>
            <td className={styles.job}></td>
            <td>{employee.value.map((entry) => entry.jobTime).reduce((previous, current) => previous + current, 0)}</td>
            <td className={styles.edit}></td>
          </tr>
        </tfoot>
      </Table>
    </>
  );
};

export default EmployeeReportCard;
