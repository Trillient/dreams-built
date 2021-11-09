import { Table } from 'react-bootstrap';

import Calendar from '../../components/Calendar';

import styles from './scheduleScreen.module.css';

import jobData from '../../data/schedule.json';

const ScheduleScreen = () => {
  const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const workItem = ['Organise job', 'Setout', 'Deliver Boxing', 'Box-up', 'Plumber/Check', 'Poly/pods', 'Inspection', 'Pour floor', 'strip floor', 'sawcut', 'Fix-up'];
  return (
    <div>
      <div>Top bar ( Search && Calendar controls)</div>
      <div className={styles.calendar}>
        <Table responsive bordered className={styles.table}>
          <thead>
            <tr>
              <th className={styles['first-coloumn']}>#</th>
              {week.map((day) => (
                <th className={styles['static-table']}>{day}</th>
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
    </div>
  );
};

export default ScheduleScreen;
