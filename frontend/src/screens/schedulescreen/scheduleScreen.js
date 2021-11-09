import Calendar from '../../components/Calendar';

import styles from './scheduleScreen.module.css';

const ScheduleScreen = () => {
  const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const workItem = ['process-plan', 'box', 'pour', 'strip', 'invoice', 'other'];
  return (
    <div>
      <div>Top bar ( Search && Calendar controls)</div>
      <div className={styles.calendar}>
        <div className={styles['top-label']}>
          <ul>
            {week.map((day) => (
              <li>{day}</li>
            ))}
          </ul>
        </div>
        <div className={styles['calendar-corner']}></div>
        <ul className={styles['item-list']}>
          {workItem.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <Calendar className={styles['calendar-content']} workItem={workItem} week={week} />
      </div>
    </div>
  );
};

export default ScheduleScreen;
