import React, { useState } from 'react';
import Login from './pages/Login';
import DatabaseDashboard from './pages/DatabaseDashboard.js';

import './App.css';

const App = () => {
  const [ name, setName ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ loggedIn, setLoggedIn ] = useState(process.env.NODE_ENV !== 'production');

  return (
    <div className="App">
      {
        loggedIn
        ? <DatabaseDashboard password={password} name={name} />
        : <Login  password={password} name={name} setPassword={setPassword} setName={setName} setLoggedIn={setLoggedIn} />
      }
    </div>
  );
}

export default App;
