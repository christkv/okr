var ShareDB = require('sharedb');
var db = require('sharedb-mongo')('mongodb://localhost:27017/test');

var backend = ShareDB({db: db});
var connection = backend.connect();

process.on('uncaughtException', function(e) {
  console.log(e);
})

// Subscribe to any database query
var query = connection.createSubscribeQuery('users', {accountId: 'acme'});

query.once('ready', function() {
  // Initially matching documents
  console.log(query.results);
});
query.on('insert', function(docs, index) {
  // Documents that now match the query
  console.log(docs);
});
query.on('remove', function(docs, index) {
  // Documents that no longer match the query
  console.log(docs);
});
query.on('move', function(docs, from, to) {
  // Documents that were moved in the results order for sorted queries
  console.log(docs);
});

// Create and modify documents with synchronously applied operations
var doc = connection.get('users', 'jane');
doc.create({accountId: 'acme', name: 'Jane'});
// doc.submitOp({p: ['email'], oi: 'jane@example.com'});
//
// // Create multiple concurrent connections to the same document for
// // collaborative editing by multiple clients
// var connection2 = backend.connect();
// var doc2 = connection2.get('users', 'jane');
//
// // Subscribe to documents directly as well as through queries
// doc2.subscribe(function(err) {
//   // Current document data
//   console.log(doc2.data);
// });
// doc2.on('op', function(op, source) {
//   // Op that changed the document
//   console.log(op);
//   // truthy if submitted locally and `false` if from another client
//   console.log(source);
// });
