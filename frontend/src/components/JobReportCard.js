import { Table } from 'react-bootstrap';

import styles from './jobReport.module.css';

const style = { width: '15%', textAlign: 'right' };

const JobReportCard = ({ job }) => {
  return (
    <div className={styles.border}>
      <h2 style={{ fontSize: '1.5rem' }}>
        {job.jobNumber} - {job.value[0]?.job?.address}
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
            <th style={style}>Rate ($/hr)</th>
            <th style={style}>Hours</th>
            <th style={style}>Cost</th>
          </tr>
        </thead>
        <tbody>
          {job.value.map((entry) => (
            <tr key={entry._id}>
              <td>
                {entry.user.firstName} {entry.user.lastName}
              </td>
              <td style={style}>$ {entry.user.hourlyRate}</td>
              <td style={style}>{entry.jobTime}</td>
              <td style={style}>$ {(entry.user.hourlyRate * entry.jobTime).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={styles.footer}>
            <th className={styles.footer}>Total</th>
            <td className={styles.footer}></td>
            <th className={styles.footer} style={style}>
              {job.value
                .map((entry) => entry.jobTime)
                .reduce((previous, current) => previous + current, 0)
                .toFixed(2)}
            </th>
            <th className={styles.footer} style={style}>
              ${' '}
              {job.value
                .map((entry) => entry.jobTime * entry.user.hourlyRate)
                .reduce((previous, current) => previous + current, 0)
                .toFixed(2)}
            </th>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
};

export default JobReportCard;
