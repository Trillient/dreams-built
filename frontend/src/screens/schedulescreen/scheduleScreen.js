import Calendar from '../../components/Calendar';

import styles from './scheduleScreen.module.css';

const ScheduleScreen = () => {
  const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const workItem = ['Organise job', 'Setout', 'Deliver Boxing', 'Box-up', 'Plumber/Check', 'Poly/pods', 'Inspection', 'Pour floor', 'strip floor', 'sawcut', 'Fix-up'];
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
