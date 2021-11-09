import styles from './Calendar.module.css';

const Calendar = ({ item, week }) => {
  return (
    <tr>
      <th>{item}</th>
      {week.map((day) => (
        <td key={day} className={styles.item}>
          {/* <div className={styles['job-insert']}>{item}</div> */}
          <div className={styles.blank}></div>
        </td>
      ))}
    </tr>
  );
};

export default Calendar;
