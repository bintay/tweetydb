const sqlite3 = require('sqlite3');

const connectSQLite = (number, callback) => {
   const db = new sqlite3.Database(`./db/sqlite/db${number}.sqlite`, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
         console.error(err.message);
      }
      console.log(`Connected to the sqlite db${number} database.`);
      callback(db);
   });
}

const bannedWords = ['insert', 'upsert', 'update', 'delete', 'drop', 'create', 'attach', 'with'];
const validateSQLite = (query) => {
   // READONLY should prevent any of this, but just to be sure
   const hasBannedWord = bannedWords.some((value) => query.toLowerCase().indexOf(value) !== -1);
   const hasMultipleStatements = query.length - query.replace(/;/g, '').length > 1;
   const hasComments = query.indexOf('--') !== -1 || query.indexOf('/*') !== -1 || query.indexOf('*/') !== -1;
   return !hasBannedWord && !hasMultipleStatements && !hasComments;
}

const processSQLite = (db, query, callback) => {
   if (!validateSQLite(query)) {
      callback({ error: `Invalid SQL: make sure you only have one semicolon, don't have any comments, and don't have any words in this list: ${JSON.stringify(bannedWords)}` });
      return;
   }

   db.all(query, (error, rows) => {
      if (error) {
         callback({ error });
      } else {
         callback({ result: JSON.stringify(rows) });
      }
   });
}

module.exports = { connectSQLite, processSQLite };
