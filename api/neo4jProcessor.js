const neo4j = require('neo4j-driver');

let secret;
try {
   secret = require('./db/neo4j/secret');
} catch (e) {
   secret = {
      "neo4j_url": process.env.NEO4J_URL,
      "neo4j_readonly_user": process.env.NEO4J_READONLY_USER,
      "neo4j_readonly_password": process.env.NEO4J_READONLY_PASSWORD
   }   
}

const connectNeo4j = () => {
   console.log('connecting to neo4j...')
   const neo4jDriver = neo4j.driver('neo4j+s://' + secret.neo4j_url, neo4j.auth.basic(secret.neo4j_readonly_user, secret.neo4j_readonly_password))
   const neo4jSession = neo4jDriver.session()
   console.log('connected to neo4j.')
   return {neo4jDriver, neo4jSession};
}

const bannedWords = ['create', 'delete', 'set', 'merge'];
const validateNeo4j = (query) => {
   // READONLY should prevent any of this, but just to be sure
   const hasBannedWord = bannedWords.some((value) => query.toLowerCase().indexOf(value) !== -1);
   const hasMultipleStatements = query.length - query.replace(/;/g, '').length > 1;
   const hasComments = query.indexOf('--') !== -1 || query.indexOf('/*') !== -1 || query.indexOf('*/') !== -1;
   return !hasBannedWord && !hasMultipleStatements && !hasComments;
}

const processNeo4j = async (session, query, callback) => {
   if (!validateNeo4j(query)) {
      callback({ error: `Invalid Neo4j: make sure you only have one semicolon, don't have any comments, and don't have any words in this list: ${JSON.stringify(bannedWords)}` });
      return;
   }

   try {
      const result = await session.run(query);
      const records = result.records;
      const tabular = [];
      records.forEach(record => {
         const rows = [];

         for (let i = 0; i < record.length; ++i) {
            const row = {
               labels: record._fields[i].labels,
               key: record.keys[i],
               ...record._fields[i].properties
            }
            rows.push(row);
         }
         
         for (const row of rows) {
            tabular.push(row);
         }
      });
      callback({ result: JSON.stringify(tabular) });
   } catch (e) {
      console.log('error running neo4j', e)
      callback({ error: e });
   }
}

module.exports = { connectNeo4j, processNeo4j };
