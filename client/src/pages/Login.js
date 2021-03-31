import React, { useState } from 'react';
import sha256 from 'js-sha256';
import './Login.css';

const Login = (props) => {
   const [error, setError] = useState('');

   const onChangeName = ({ target: { value }}) => {
      props.setName(value);
   }

   const onChangePassword = ({ target: { value }}) => {
      props.setPassword(value);
   }

   const onLogin = (e) => {
      if (sha256(props.password) === '963bc8dd7a0e621416f1a1f846d5a7731e3771f7af52712080a33f984db5e617'
         || sha256(props.password) === 'a8c2299252a5b982235b1806dc09b477dd2681e94dfa3760326d73aa25d56b84') {
         props.setLoggedIn(true);
      } else {
         setError('Check your password — tweety didn\'t like that one');
      }
   }

   const onKeyDown = (e) => {
      if (e.key === "Enter") {
         onLogin();
      }
   }

   return (
      <div className='login' onKeyDown={onKeyDown}>
         <img src='/tweety.png' alt='' /><br />
         <h2>S.S. Tweety System Dashboard</h2>
         <input onChange={onChangeName} name="name" value={props.name} placeholder="Name" type="text" /><br />
         <input onChange={onChangePassword} name="password" value={props.password} placeholder="Password" type="text" /><br />
         <p>{error}</p>
         <button onClick={onLogin}>Access System</button>
      </div>
   )
}

export default Login;
