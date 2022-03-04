import { Table } from 'react-bootstrap';

import styles from './jobReport.module.css';

const JobReportCard = ({ job }) => {
  return (
    <div className={styles.border}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        {job.jobNumber} - {job.value[0]?.job?.address}
      </h2>
      <p className={styles.dates}>
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
            <th className={`${styles.col} ${styles.rate}`}>Rate ($/hr)</th>
            <th className={`${styles.col} ${styles.time}`}>Hours</th>
            <th className={styles.col}>Cost</th>
          </tr>
        </thead>
        <tbody>
          {job.value.map((entry) => (
            <tr key={entry._id}>
              <td>
                {entry?.user?.firstName} {entry?.user?.lastName}
              </td>
              <td className={`${styles.col} ${styles.rate}`}>$ {entry?.user?.hourlyRate}</td>
              <td className={`${styles.col} ${styles.time}`}>{entry?.jobTime}</td>
              <td className={styles.col}>$ {(entry?.user?.hourlyRate * entry?.jobTime)?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={styles.footer}>
            <th className={styles.footer}>Total</th>
            <td className={`${styles.footer} ${styles.rate}`}></td>
            <th className={`${styles.footer} ${styles.time} ${styles.col}`}>
              {job.value
                .map((entry) => entry.jobTime)
                .reduce((previous, current) => previous + current, 0)
                .toFixed(2)}
            </th>
            <th className={`${styles.footer} ${styles.col}`}>
              ${' '}
              {job?.value
                ?.map((entry) => entry.jobTime * entry.user.hourlyRate)
                .reduce((previous, current) => previous + current, 0)
                ?.toFixed(2)}
            </th>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
};

export default JobReportCard;
