import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import Table from '../components/Table';

const APIPrefix = process.env.NODE_ENV === 'production' ? 'https://tweetydb-api.herokuapp.com' : 'http://localhost:4000'

const Admin = () => {
   const [ logs, setLogs ] = useState([]);
   const [ nameFilter, setNameFilter ] = useState('');
   const [ questionFilter, setQuestionFilter ] = useState('');
   const [ onlyShowIncorrect, setOnlyShowIncorrect ] = useState(false);

   const mapLogs = (log, index) => {
      const newLog = {
         'Name': log.name,
         'Question Number': log.id,
         'Query': log.query,
         ...log
      };
      delete newLog.id;
      delete newLog.name;
      delete newLog.query;
      return newLog;
   }

   useEffect(() => {
      const io = socketIOClient(APIPrefix);

      io.on('full_logs', (data) => {
         setLogs(data);
      });

      io.on('new_log', (data) => {
         setLogs(logs => logs.concat([data]));
      });
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <div>
         <h1>Mentor Logs</h1>
         <div>
            <h2 style={{ marginBottom: -10 }}>Filter By</h2>
            <label style={{ fontSize: 20, whiteSpace: 'nowrap' }}>
               Name: 
               <input 
                  style={{ fontSize: 20, padding: 2, width: 200, minWidth: 0 }} 
                  type='text'
                  value={nameFilter} 
                  onChange={(e) => setNameFilter(e.target.value)} 
               />
            </label>
            <span style={{ width: 40, display: 'inline-block' }} />
            <label style={{ fontSize: 20, whiteSpace: 'nowrap' }}>
               Question: 
               <input 
                  style={{ fontSize: 20, padding: 2, width: 60, minWidth: 0 }} 
                  type='text' 
                  value={questionFilter} 
                  onChange={(e) => setQuestionFilter(e.target.value)} 
               />
            </label>
            <span style={{ width: 40, display: 'inline-block' }} />
            <label style={{ fontSize: 20, whiteSpace: 'nowrap' }}>
               Only Incorrect Submission: 
               <input 
                  style={{ fontSize: 20, padding: 2, width: 20, minWidth: 0, verticalAlign: 'top', marginTop: 24, marginLeft: 4 }} 
                  type='checkbox' 
                  checked={onlyShowIncorrect} 
                  onChange={(e) => setOnlyShowIncorrect(e.target.checked)} 
               />
            </label>
         </div>
         {onlyShowIncorrect}
         <Table 
            style={{ background: '#000' }} 
            noMaxHeight 
            title='Recent Submissions' 
            rows={
               logs
               .filter((row) => (nameFilter.length === 0 || row.name.toLowerCase() === nameFilter.toLowerCase())
                                 && (questionFilter.length === 0 || row.id.toString() === questionFilter)
                                 && (!onlyShowIncorrect || !row.correct))
               .sort((a, b) => b.logId - a.logId)
               .map(mapLogs)
            } 
         />
         {logs.filter((row) => !((nameFilter.length === 0 || row.name.toLowerCase() === nameFilter.toLowerCase())
                                && (questionFilter.length === 0 || row.id.toString() === questionFilter)
                                && (!onlyShowIncorrect || !row.correct))).length}
         &nbsp;row(s) not shown due to filters
      </div>
   )
};

export default Admin;
