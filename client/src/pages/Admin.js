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

   const leadingZeros = (num, length) => {
      num = num.toString();
      return (new Array(length - num.length)).fill(0).join('') + num;
   }

   const filterLogs = (log) => {
      return ((nameFilter.length === 0 || log.name.toLowerCase() === nameFilter.toLowerCase())
            && (questionFilter.length === 0 || log.id.toString() === questionFilter)
            && (!onlyShowIncorrect || !log.correct))
   }

   const getUserProgress = () => {
      const usersToLastSubmission =  {};
      for (const log of logs) {
         const lastSubmission = usersToLastSubmission[log.name];
         if ((!lastSubmission || new Date(log.time) > new Date(lastSubmission.time)) && log.correct) {
            usersToLastSubmission[log.name] = { 
               question: log.id, 
               time: new Date(log.time)
            }
         }

         if (!lastSubmission && !log.correct) {
            usersToLastSubmission[log.name] = { 
               question: -1,
               time: new Date(log.time)
            }
         }
      }

      const tabularUserToSubmission = [];
      for (const name in usersToLastSubmission) {
         tabularUserToSubmission.push({ name, ...usersToLastSubmission[name] })
      }
      return tabularUserToSubmission
             .sort((a, b) => new Date(b.time) - new Date(a.time))
             .map(log => ({
                ...log, 
                time: leadingZeros(log.time.getHours(), 2) + ':' + leadingZeros(log.time.getMinutes(), 2) + ':' + leadingZeros(log.time.getSeconds(), 2)
             }));
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
         <h2 style={{ fontSize: 30 }}>User Progress</h2>
         <Table 
            style={{ background: '#000' }} 
            rows={getUserProgress()} 
         />
         <h2 style={{ fontSize: 30, marginTop: 100 }}>Raw Submission Logs</h2>
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
               .filter((row) => filterLogs(row))
               .sort((a, b) => b.logId - a.logId)
               .map(mapLogs)
            } 
         />
         {logs.filter((row) => !filterLogs(row)).length}
         &nbsp;row(s) not shown due to filters
      </div>
   )
};

export default Admin;
