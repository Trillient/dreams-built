import { Table } from 'react-bootstrap';

import styles from './jobListScreen.module.css';
import jobList from '../../data/jobList.json';

const JobListScreen = () => {
  return (
    <div>
      <h1>Jobs</h1>
      <div>Search job || Sort By customer/newest/oldest/paid || Update table columns</div>
      <section className={styles.table}>
        <Table hover>
          <thead className={styles['table-head']}>
            <th>Job Number</th>
            <th>Company</th>
            <th>Address</th>
            <th>City</th>
            <th>Client</th>
            <th>m&sup2;</th>
            <th>Invoiced</th>
          </thead>
          <tbody>
            {jobList.map((job) => (
              <tr className={styles.row}>
                <td>{job.jobNumber}</td>
                <td className={`${styles[job.company]} ${styles.company}`}>{job.company}</td>
                <td>{job.address}</td>
                <td>{job.city}</td>
                <td>{job.client}</td>
                <td>{job.squareMeters}</td>
                <td>{job.isInvoiced}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>
      <div>Pagination</div>
    </div>
  );
};

export default JobListScreen;
