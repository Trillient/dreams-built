import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import './bootstrap.min.css';

import Layout from './components/layout/Layout';

import HomeScreen from './screens/homeScreen/HomeScreen';
import DashboardScreen from './screens/dashboardScreen/DashboardScreen';
import TimeSheetScreen from './screens/timeSheetScreen/TimeSheetScreen';
import ScheduleScreen from './screens/scheduleScreen/scheduleScreen';
import JobListScreen from './screens/jobListScreen/JobListScreen';
import JobDetailsScreen from './screens/jobDetailsScreen/JobDetailsScreen';
import Profile from './screens/profileScreen/ProfileScreen';
import CreateJobScreen from './screens/createJobScreen/CreateJobScreen';
import ClientListScreen from './screens/clientListScreen/ClientListScreen';
import CreateClientScreen from './screens/createClientScreen/CreateClientScreen';
import EditClientScreen from './screens/editClientScreen/EditClientScreen';
import JobPartScreen from './screens/jobPartScreen/JobPartScreen';
import CreateJobPartScreen from './screens/createJobPartScreen/CreateJobPartScreen';
import EditJobPartScreen from './screens/editJobPartScreen/EditJobPartScreen';
import EmployeesScreen from './screens/employeesScreen/EmployeesScreen';
import EditEmployeeScreen from './screens/editEmployeeScreen/EditEmployeeScreen';
import TimeSheetReportScreen from './screens/timesheetReportScreen/TimeSheetReportScreen';

const App = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={isAuthenticated ? <DashboardScreen /> : <HomeScreen />} />
          <Route path="dashboard" element={<DashboardScreen />} />
          <Route path="timesheet" element={<TimeSheetScreen />} />
          <Route path="clients" element={<ClientListScreen />} />
          <Route path="clients/edit/:id" element={<EditClientScreen />} />
          <Route path="clients/create" element={<CreateClientScreen />} />
          <Route path="jobs" element={<JobListScreen />} />

          <Route path="job/details/:id" element={<JobDetailsScreen />} />
          <Route path="jobs/create" element={<CreateJobScreen />} />

          <Route path="jobparts" element={<JobPartScreen />} />

          <Route path="jobparts/edit/:id" element={<EditJobPartScreen />} />
          <Route path="jobparts/create" element={<CreateJobPartScreen />} />

          <Route path="employees" element={<EmployeesScreen />} />
          <Route path="employees/edit/:id" element={<EditEmployeeScreen />} />

          <Route path="schedule" element={<ScheduleScreen />} />
          <Route path="profile" element={<Profile />} />
          <Route path="reports/timesheets" element={<TimeSheetReportScreen />} />
        </Routes>
      </Layout>
    </Router>
  );
};
export default App;
