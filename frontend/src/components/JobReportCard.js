import { Table } from 'react-bootstrap';

const JobReportCard = ({ job }) => {
  return (
    <>
      <h2>
        {job.jobNumber} - {job.value[0].address}
      </h2>
      <p>
        <strong>
          <em>
            {job.value[0].weekStart} - {job.value[0].weekEnd}
          </em>
        </strong>
      </p>
      <Table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Rate ($/hr)</th>
            <th>Cost</th>
            <th>Times</th>
          </tr>
        </thead>
        <tbody>
          {job.value.map((entry) => (
            <tr key={entry._id}>
              <td>
                {entry.user.firstName} {entry.user.lastName}
              </td>
              <td>$ {entry.user.hourlyRate}</td>
              <td>$ {entry.user.hourlyRate * entry.jobTime}</td>
              <td>{entry.jobTime}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>Total</th>
            <td></td>
            <td>$ {job.value.map((entry) => entry.jobTime * entry.user.hourlyRate).reduce((previous, current) => previous + current, 0)}</td>
            <td>{job.value.map((entry) => entry.jobTime).reduce((previous, current) => previous + current, 0)}</td>
          </tr>
        </tfoot>
      </Table>
    </>
  );
};

export default JobReportCard;
