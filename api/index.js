const express = require('express');
const bodyParser = require('body-parser');
const { connectSQLite, processSQLite } = require('./sqliteProcessor');
const correctAnswers = require('./correctAnswers');
const cors = require('cors');
const sha256 = require('js-sha256');
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
   cors: {
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      "optionsSuccessStatus": 204
   }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const logs = [];
let logNumber = 0;

let sqliteConnection;
connectSQLite(0, (db) => {
   sqliteConnection = db;
});

const processQuery = (type, query, callback) => {
   switch (type) {
      case "sqlite":
         return processSQLite(sqliteConnection, query, callback);
      case "mongodb":
         return processMongoDB(query, callback);
      case "neo4j":
         return processNeo4j(query, callback);
   }
}

const getAnswer = (id) => correctAnswers[id];

const addLog = (record) => {
   logs.push(record);
   io.emit('new_log', record);
};

app.post('/submit', (req, res) => {
   console.log('Got request: ', req.body);
   const { type, query, id, name, password } = req.body;
   const logRecord = { type, query, id, name, password, time: new Date(), logId: ++logNumber, result: 'no results', error: 'no error', correct: false };

   if (sha256(password) !== '963bc8dd7a0e621416f1a1f846d5a7731e3771f7af52712080a33f984db5e617') {
      res.status(200);
      res.json({ error: 'Incorrect password' });
      addLog(logRecord);
      return;
   }

   processQuery(type, query, ({error, result}) => {
      const answer = getAnswer(id);
      const correct = answer === result;

      logRecord['result'] = result || 'no results';
      logRecord['error'] = error || 'no error';
      logRecord['correct'] = correct || false;
      addLog(logRecord);

      if (error) {
         res.status(200);
         res.json({ error });
      } else {
         res.status(200);
         res.json({ result, correct });
      }
   });
});

io.on('connection', function(client) {
   console.log('Client connected...');
   client.emit('full_logs', logs);
});

server.listen(process.env.PORT || 4000);
