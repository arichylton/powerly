import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './components/Home/Home';
import Header from './components/Header/Header';
import Wilks from './components/Wilks/Wilks';
import Goals from './components/Goals/Goals';
import ErrorPage from './components/ErrorPage/ErrorPage';
import Plan from './components/Plan/Plan';
import Progress from './components/Progress/Progress';
import Stretching from './components/Stretching/Stretching';
import Partners from './components/Partners/Partners';
import Diet from './components/Diet/Diet';
import Meditation from './components/Meditation/Meditation';
import Footer from './components/Footer/Footer';
import './App.css';

const App = () => {
  return (
    <Router basename='/'>
      <div className='main-body'>
        <Header />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/wilks' exact component={Wilks} />
          <Route path='/plan' exact component={Plan} />
          <Route path='/diet' exact component={Diet} />
          <Route path='/progress' exact component={Progress} />
          <Route path='/stretching' exact component={Stretching} />
          <Route path='/meditation' exact component={Meditation} />
          <Route path='/partners' exact component={Partners} />
          <Route path='*' component={ErrorPage} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
