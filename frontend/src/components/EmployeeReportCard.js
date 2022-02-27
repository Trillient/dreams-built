import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';

import EmployeeRow from './EmployeeRow';

import styles from './employeeReportCard.module.css';

const EmployeeReportCard = ({ employee }) => {
  const [title, setTitle] = useState('');

  const firstName = employee.firstName;
  const lastName = employee.lastName;
  const email = employee.auth0Email;

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
            {employee.entries[0]?.weekStart} - {employee.entries[0]?.weekEnd}
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
          {employee.entries.map((entry) => (
            <EmployeeRow entry={entry} key={entry._id} />
          ))}
        </tbody>
        <tfoot className={styles.footer}>
          <tr>
            <th>Total</th>
            <td className={styles.time}></td>
            <td className={styles.time}></td>
            <td className={styles.job}></td>
            <td>
              {employee.entries
                .map((entry) => entry.jobTime)
                .reduce((previous, current) => previous + current, 0)
                .toFixed(2)}
            </td>
            <td className={styles.edit}></td>
          </tr>
        </tfoot>
      </Table>
      {employee.comments.length > 0 && (
        <div className={styles.card}>
          <h3 style={{ textAlign: 'center', fontSize: '1.5rem' }}>Comments</h3>
          {employee.comments.map(({ comments, day }) => (
            <div key={day}>
              <h4 style={{ fontSize: '1.2rem' }}>{day}</h4>
              <p style={{ marginLeft: '1.2rem', color: 'grey' }}>{comments}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default EmployeeReportCard;
