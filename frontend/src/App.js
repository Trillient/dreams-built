import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TimeSheetScreen from "./screens/TimeSheetScreen";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Route path="/timesheet/:id" component={TimeSheetScreen} />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};
export default App;
