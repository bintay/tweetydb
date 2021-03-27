import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import Table from '../components/Table';

const APIPrefix = process.env.NODE_ENV === 'production' ? 'https://tweetydb-api.herokuapp.com' : 'http://localhost:4000'

const Admin = () => {
   const [ logs, setLogs ] = useState([]);
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
      console.log('mounted');
      const io = socketIOClient(APIPrefix);

      io.on('full_logs', (data) => {
         console.log('full_logs', data)
         setLogs(data);
      });

      io.on('new_log', (data) => {
         console.log('new_log', data);
         console.log('old_logs', logs);
         setLogs(logs => logs.concat([data]));
      });
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <div>
         <Table style={{ background: '#000' }} noMaxHeight title='Recent Submissions' rows={logs.sort((a, b) => b.logId - a.logId).map(mapLogs)} />
      </div>
   )
};

export default Admin;
