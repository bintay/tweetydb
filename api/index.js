const express = require('express');
const bodyParser = require('body-parser');
const { connectSQLite, processSQLite } = require('./sqliteProcessor');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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

const getAnswer = () => 'wrong';

app.post('/submit', (req, res) => {
   console.log(req.body);
   const { type, query, id } = req.body;
   processQuery(type, query, ({error, result}) => {
      const answer = getAnswer(id);
      const correct = answer === result;

      if (error) {
         res.status(400);
         res.json({ error });
      } else {
         res.status(200);
         res.json({ result, correct });
      }
   });
});

app.listen(4000);
