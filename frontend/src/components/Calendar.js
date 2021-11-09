import styles from './Calendar.module.css';

const Calendar = ({ className, workItem, week }) => {
  return (
    <div className={`${className} ${styles.divider}`}>
      {week.map((day) => (
        <ul key={day} className={styles.day}>
          {workItem.map((item) => (
            <li className={styles.item}>
              <div className={styles['job-insert']}>{item}</div>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
};

export default Calendar;
