import { LinkContainer } from 'react-router-bootstrap';
import styles from './Calendar.module.css';

const Calendar = ({ item, week, jobData }) => {
  const actionItem = jobData.filter((job) => job.jobPart === item);

  return (
    <tr>
      <th>{item}</th>
      {week.map((day) => (
        <td key={day} className={styles.item}>
          {actionItem
            .filter((job) => job.day === day)
            .map((job, index) => (
              <LinkContainer key={index} style={{ backgroundColor: job.color }} to={`/job/details/${job.jobNumber}`}>
                <div className={styles['job-insert']}>{job.jobNumber}</div>
              </LinkContainer>
            ))}
          <div className={styles.blank}></div>
        </td>
      ))}
    </tr>
  );
};

export default Calendar;
