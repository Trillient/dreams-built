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
import ClientListScreen from './screens/clientListScreen/ClientListScreen';
import CreateClientScreen from './screens/createClientScreen/CreateClientScreen';
import EditClientScreen from './screens/editClientScreen/EditClientScreen';
import JobPartScreen from './screens/jobPartScreen/JobPartScreen';
import CreateJobPartScreen from './screens/createJobPartScreen/CreateJobPartScreen';
import EditJobPartScreen from './screens/editJobPartScreen/EditJobPartScreen';

const App = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <Router>
      <Layout>
        <Route path="/" exact component={isAuthenticated ? DashboardScreen : HomeScreen} />
        <Route path="/dashboard" exact component={DashboardScreen} />
        <Route path="/timesheet" exact component={TimeSheetScreen} />
        <Route path="/clients" exact component={ClientListScreen} />
        <Route path="/clients/create" exact component={CreateClientScreen} />
        <Route path="/clients/edit/:id" exact component={EditClientScreen} />
        <Route path="/jobs" exact component={JobListScreen} />
        <Route path="/jobs/create" exact component={CreateJobScreen} />
        <Route path="/job/details/:id" exact component={jobDetailsScreen} />
        <Route path="/jobparts" exact component={JobPartScreen} />
        <Route path="/jobparts/create" exact component={CreateJobPartScreen} />
        <Route path="/jobparts/edit/:id" exact component={EditJobPartScreen} />
        <Route path="/employees" />
        <Route path="/employees/edit/:id" />
        <Route path="/schedule" exact component={ScheduleScreen} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/reports/timesheets" />
      </Layout>
    </Router>
  );
};
export default App;
