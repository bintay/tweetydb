import React, { useState } from 'react';
import Login from './Login';
import DatabaseDashboard from './DatabaseDashboard.js';

const App = () => {
   const [ name, setName ] = useState('');
   const [ password, setPassword ] = useState('');
   const [ loggedIn, setLoggedIn ] = useState(false);

   return (
      <div className='App'>
         {
            loggedIn
            ? <DatabaseDashboard password={password} name={name} />
            : <Login password={password} name={name} setPassword={setPassword} setName={setName} setLoggedIn={setLoggedIn} />
         }
      </div>
   );
}

export default App;
