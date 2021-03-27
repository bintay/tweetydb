const connectSQLite = (number, callback) => {
   const db = new sqlite3.Database(`./db/sqlite/db${number}.sqlite`, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
         console.error(err.message);
      }
      console.log(`Connected to the sqlite db${number} database.`);
      callback(db);
   });
}

const processSQLite = (db, query) => {
   
}