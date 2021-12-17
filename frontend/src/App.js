import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import './bootstrap.min.css';

import Layout from './components/layout/Layout';

import HomeScreen from './screens/homeScreen/HomeScreen';
import DashboardScreen from './screens/dashboardScreen/DashboardScreen';
import TimeSheetScreen from './screens/timeSheetScreen/TimeSheetScreen';
import ScheduleScreen from './screens/scheduleScreen/scheduleScreen';
import JobListScreen from './screens/jobListScreen/JobListScreen';
import jobDetailsScreen from './screens/jobDetailsScreen/jobDetailsScreen';
import Profile from './screens/profileScreen/ProfileScreen';
import CreateJobScreen from './screens/createJobScreen/CreateJobScreen';

const App = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <Router>
      <Layout>
        <Route path="/" exact component={isAuthenticated ? DashboardScreen : HomeScreen} />
        <Route path="/dashboard" exact component={DashboardScreen} />
        <Route path="/timesheet" exact component={TimeSheetScreen} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/schedule" exact component={ScheduleScreen} />
        <Route path="/job/details/:jobNumber" exact component={jobDetailsScreen} />
        <Route path="/jobs" exact component={JobListScreen} />
        <Route path="/jobs/create" exact component={CreateJobScreen} />
      </Layout>
    </Router>
  );
};
export default App;
