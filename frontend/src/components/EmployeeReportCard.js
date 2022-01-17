import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import EmployeeRow from './EmployeeRow';

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
  }, []);

  return (
    <>
      <h2>{title}</h2>
      <p>
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
            <th>Start Time</th>
            <th>End Time</th>
            <th>Total Time</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {employee.value.map((entry) => (
            <EmployeeRow entry={entry} key={entry._id} />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>Total</th>
            <td></td>
            <td></td>
            <td>{employee.value.map((entry) => entry.jobTime).reduce((previous, current) => previous + current, 0)}</td>
          </tr>
        </tfoot>
      </Table>{' '}
    </>
  );
};

export default EmployeeReportCard;
