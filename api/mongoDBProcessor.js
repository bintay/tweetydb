const MongoClient = require('mongodb').MongoClient;

let secret;
try {
   secret = require('./db/mongo/secret');
} catch (e) {
   secret = {
      "mongo_url": process.env.MONGO_URL,
      "mongo_readonly_user": process.env.MONGO_READONLY_USER,
      "mongo_readonly_password": process.env.MONGO_READONLY_PASSWORD
   }   
}

const uri = `mongodb+srv://${secret.mongo_readonly_user}:${secret.mongo_readonly_password}@${secret.mongo_url}/practice?retryWrites=true&w=majority`;
const dbname = `tweety`;
console.log(uri);

const bannedWords = ['insert', 'upsert', 'update', 'delete', 'drop', 'create', 'attach', 'clean', 'hydrate', 'watch', 'populate', 'overwrite', 'parent', 'invalidate', 'depopulate'];
const validateMongoDB = (query) => {
   // READONLY should prevent any of this, but just to be sure
   const hasBannedWord = bannedWords.some((value) => query.toLowerCase().indexOf(value) !== -1);
   const hasMultipleStatements = query.length - query.replace(/;/g, '').length > 1;
   const hasComments = query.indexOf('--') !== -1 || query.indexOf('/*') !== -1 || query.indexOf('*/') !== -1 || query.indexOf('//') !== -1;
   return !hasBannedWord && !hasMultipleStatements && !hasComments;
}

const parseMongoDB = (query) => {
   // matches "db.collection.find({ anything: {}, $or: [ x: { $lt: 3 } ] }).exec();"
   return query.match(/db\.([^.]+)\.([^(]+)\(([^)]+)\)\.([^(]+)\(\);/);
}

const processMongoDB = (query, callback) => {
   if (!validateMongoDB(query)) {
      callback({ error: `Invalid MongoDB: make sure you only have one semicolon, don't have any comments, and don't have any words in this list: ${JSON.stringify(bannedWords)}` });
      return;
   }

   const parsed = parseMongoDB(query);
   if (!parsed) {
      callback({ error: `Error: We couldn't parse your query! Make sure all your braces and parenthesis are correct, don't forget your semicolon, and reach out to a mentor for help if you're stuck!` });
      return;
   }

   const collection = parsed[1];
   const command = parsed[2];
   const commandParameter = parsed[3];
   const shouldBeExec = parsed[4];
   if (command !== 'find') {
      callback({ error: `Error: Make sure you're only using find() and not inserting! Reach out to a mentor if you're stuck!` });
      return;
   }

   if (shouldBeExec !== 'exec') {
      callback({ error: `Error: Make sure you're using exec() properly! Reach out to a mentor if you're stuck!` });
      return;
   }

   let parameter;
   try {
      parameter = JSON.parse(commandParameter);
   } catch (e) {
      try {
         const fixedJSON = commandParameter.replace(/(['"])?([$a-zA-Z0-9_]+)(['"])? ?:/g, '"$2": ').replace(/\s*\}\s*/g, '}').replace(/\s*\]\s*/g, ']').replace(/\s*\{\s*/g, '{').replace(/\s*\[\s*/g, '[').replace(/\s*\:\s*/g, ':');
         console.log('fixed json:',fixedJSON);
         parameter = JSON.parse(fixedJSON);
      } catch (e) {
         const fixedJSON = commandParameter.replace(/(['"])?([$a-zA-Z0-9_]+)(['"])? ?:/g, '"$2": ').replace(/\s*\}\s*/g, '}').replace(/\s*\]\s*/g, ']').replace(/\s*\{\s*/g, '{').replace(/\s*\[\s*/g, '[').replace(/\s*\:\s*/g, ':');
         callback({ error: `Error: We couldn't parse your command parameter! Ask a mentor for help! JSON Error: ${e}, String: ${commandParameter}, Fixed String: ${fixedJSON}` });
         return;
      }
   }

   console.log('mongo param: ', parameter);
   console.log(uri);

   MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
         console.log(err);
         callback({ error: "Mongo Error: " + JSON.stringify(err) });
         return;
      }

      const db = client.db(dbname);

      db.collection(collection).find(parameter).toArray((err, res) => {
         if (err) {
            callback({ error: JSON.stringify(err) + ' // ' + err.toString() });
         } else {
            callback({ result: JSON.stringify(res) });
         }
         client.close();
      })
   })
}

module.exports = { processMongoDB };
