import styles from './Calendar.module.css';

const Calendar = ({ className, workItem }) => {
  const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className={`${className} ${styles.divider}`}>
      {week.map((day) => (
        <ul key={day} className={styles.day}>
          {workItem.map((item) => (
            <li className={styles.item}>{item}</li>
          ))}
        </ul>
      ))}
    </div>
  );
};

export default Calendar;
