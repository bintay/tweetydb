const express = require('express');
const app = express();

const processQuery = (type, query) => {
   switch (type) {
      case "sqlite":
         return processSQLite(query);
      case "mongodb":
         return processMongoDB(query);
      case "neo4j":
         return processNeo4j(query);
   }
}

app.post('/submit', (req, res) => {
   const { type, query, id } = req.body;
   const { result, error } = processQuery(type, query);
   const answer = getAnswer(id);
   const correct = answer === result;

   if (error) {
      res.status(400);
      res.json({ error });
      return;
   } else {
      res.status(200);
      res.json({ result, correct });
   }
});

app.listen(3000);
