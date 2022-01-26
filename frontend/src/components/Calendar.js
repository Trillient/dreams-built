import { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import fontColorContrast from 'font-color-contrast';

import styles from './Calendar.module.css';

const Calendar = ({ jobPart, week, dueDates, loading, dueDateLoading }) => {
  const [actionItem, setActionItem] = useState('');

  useEffect(() => {
    if (!loading && !dueDateLoading && dueDates) {
      const search = dueDates.filter((dueDate) => dueDate.jobPartTitle._id === jobPart._id);
      setActionItem(search);
    }
  }, [dueDates, jobPart, loading, dueDateLoading]);

  return (
    !loading &&
    !dueDateLoading && (
      <tr>
        <th>{jobPart.jobPartTitle}</th>
        {week.map(({ isoDate }) => (
          <td key={isoDate} className={styles.item}>
            {actionItem &&
              actionItem
                .filter((dueDate) => dueDate.dueDateRange.includes(isoDate))
                .map((job) => (
                  <LinkContainer key={job.job._id} style={{ backgroundColor: job.job.color, color: fontColorContrast(job.job.color) }} to={`/job/details/${job.job._id}`}>
                    <div className={styles['job-insert']}>
                      {job.job.jobNumber} - {job.job.address}
                    </div>
                  </LinkContainer>
                ))}
            <div className={styles.blank}></div>
          </td>
        ))}
      </tr>
    )
  );
};

export default Calendar;
