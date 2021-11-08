import Calendar from '../../components/Calendar';

import styles from './scheduleScreen.module.css';

const ScheduleScreen = () => {
  const workItem = ['process-plan', 'box', 'pour', 'strip', 'invoice'];
  return (
    <div>
      <div>Top bar ( Search && Calendar controls)</div>
      <div className={styles.calendar}>
        <div className={styles['top-label']}>Top label</div>
        <div className={styles['calendar-corner']}>Blank</div>
        <div className={styles['side-label']}>
          {workItem.map((item, index) => (
            <ul key={index} className={styles['item-list']}>
              <li>{item}</li>
            </ul>
          ))}
        </div>
        <Calendar className={styles['calendar-content']} workItem={workItem} />
      </div>
    </div>
  );
};

export default ScheduleScreen;
