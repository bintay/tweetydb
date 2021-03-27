import React from 'react';
import Practice from './pages/Practice';
import Admin from './pages/Admin';
import { BrowserRouter as Router, Route } from "react-router-dom";

import './App.css';

const App = () => {
  return (
    <Router>
      <Route path="/" exact><Practice /></Route>
      <Route path="/admin"><Admin /></Route>
    </Router>
  );
}

export default App;
