import { useState, useEffect } from 'react';
import fontColorContrast from 'font-color-contrast';

import ScheduleEditDueDate from './modals/ScheduleEditDueDate';
import ScheduleCreateDueDate from './modals/ScheduleCreateDueDate';

import styles from './calendar.module.css';

const Calendar = ({ jobPart, week, dueDates, loading, dueDateLoading }) => {
  const [actionItem, setActionItem] = useState('');
  const [modalEditShow, setModalEditShow] = useState(false);
  const [modalCreateShow, setModalCreateShow] = useState(false);
  const [date, setDate] = useState('');
  const [job, setJob] = useState('');

  useEffect(() => {
    if (!loading && !dueDateLoading && dueDates) {
      const search = dueDates.filter((dueDate) => dueDate.jobPartTitle._id === jobPart._id);
      setActionItem(search);
    }
  }, [dueDates, jobPart, loading, dueDateLoading]);

  const editJobHandler = (e, job, date) => {
    e.stopPropagation();
    setModalEditShow(true);
    setDate(date);
    setJob(job);
  };

  return (
    !loading &&
    !dueDateLoading && (
      <>
        <tr>
          <th>{jobPart.jobPartTitle}</th>
          {week.map(({ isoDate, date }) => (
            <td key={isoDate} className={styles.item} onClick={() => setModalCreateShow(true)}>
              {actionItem &&
                actionItem
                  .filter((dueDate) => dueDate.dueDateRange.includes(isoDate))
                  .map((job) => (
                    <div
                      key={job.job._id}
                      style={{ backgroundColor: job.job.color, color: fontColorContrast(job.job.color), borderRadius: '0.2rem' }}
                      onClick={(e) => {
                        editJobHandler(e, job.job, date);
                      }}
                    >
                      <div className={styles['job-insert']}>
                        {job.job.jobNumber} - {job.job.address}
                      </div>
                    </div>
                  ))}
              <div className={styles.blank}></div>
            </td>
          ))}
        </tr>
        <ScheduleEditDueDate show={modalEditShow} date={date} job={job} jobPart={jobPart} setModalShow={setModalEditShow} onHide={() => setModalEditShow(false)} />
        <ScheduleCreateDueDate show={modalCreateShow} date={date} job={job} jobPart={jobPart} setModalShow={setModalCreateShow} onHide={() => setModalCreateShow(false)} />
      </>
    )
  );
};

export default Calendar;
