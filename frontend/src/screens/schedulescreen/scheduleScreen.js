import { Table, Button } from 'react-bootstrap';

import Calendar from '../../components/Calendar';

import styles from './scheduleScreen.module.css';

import jobData from '../../data/schedule.json';
import CustomMenu from '../../components/CustomMenu';

const ScheduleScreen = () => {
  const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const workItem = ['Organise job', 'Setout', 'Deliver Boxing', 'Box-up', 'Plumber/Check', 'Poly/pods', 'Inspection', 'Pour floor', 'strip floor', 'sawcut', 'Fix-up'];
  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <CustomMenu className={styles.search} />
        <p>Pagination</p>
        <Button className={styles.button}>+</Button>
      </div>
      <Table responsive bordered className={styles.table}>
        <thead>
          <tr>
            <th className={styles['first-coloumn']}>#</th>
            {week.map((day) => (
              <th key={day} className={styles['static-table']}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {workItem.map((item) => (
            <Calendar key={item} item={item} week={week} jobData={jobData} />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ScheduleScreen;
