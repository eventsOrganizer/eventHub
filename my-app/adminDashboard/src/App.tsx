import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import UserList from './components/Users/UserList';
import TrafficOverview from './components/Analytics/TrafficOverview';
import ManageContent from './components/ContentManagement/ManageContent';
import AppSettings from './components/Settings/AppSettings';
import SystemAlerts from './components/Notifications/SystemAlerts';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Switch>
          <Route path="/" exact component={DashboardOverview} />
          <Route path="/users" component={UserList} />
          <Route path="/analytics" component={TrafficOverview} />
          <Route path="/content" component={ManageContent} />
          <Route path="/settings" component={AppSettings} />
          <Route path="/notifications" component={SystemAlerts} />
        </Switch>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
