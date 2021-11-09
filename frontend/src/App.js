import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import './bootstrap.min.css';

import Header from './components/Header';
import Footer from './components/Footer';
import TimeSheetScreen from './screens/timesheetscreen/TimeSheetScreen';
import ScheduleScreen from './screens/schedulescreen/scheduleScreen';
import JobListScreen from './screens/jobListScreen/JobListScreen';

const App = () => {
  return (
    <Router>
      <div className="grid">
        <Header />
        <main className="py-3 main background">
          <Container>
            <Route path="/timesheet" component={TimeSheetScreen} />
            {/* <Route path="/timesheetdetails" component={TimeSheetDetailsScreen} />
            <Route path="/profile" component={ProfileScreen} />
            <Route path="/users" component={UserListScreen} />
            <Route path="/users/profile" component={ProfileScreen} /> */}
            <Route path="/schedule" component={ScheduleScreen} />
            {/* <Route path="/job/details" component={JobDetailsScreen} /> */}
            <Route path="/jobslist" component={JobListScreen} />
          </Container>
        </main>
        <Footer />
      </div>
    </Router>
  );
};
export default App;
