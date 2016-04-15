"use strict";

var ShareDB = require('sharedb'),
  express = require('express'),
  co = require('co'),
  MongoClient = require('mongodb').MongoClient,
  connectSharedMongo = require('sharedb-mongo');

// Settings
var url = 'mongodb://localhost:27017/okr';
var port = 8080;

function socketIOHandler(io, socket, context) {
  // Get the db and sharedb context
  var db = context.db;
  var backend = context.backend;
  var connection = null;
  // Last update
  var text = null;

  // Editing event
  socket.on('editing', function(document) {
    // console.log("------------- editing :: " + document.id)
    // Get connection to document
    var doc = connection.get('documents', "" + document.id);
    // Keep latest update
    text = document.text;
    // Replace the whole document for now, shoud be optimized to use
    // partial updates
    doc.submitOp({
      p: ['text'], oi: document.text
    });
  });

  // Register event
  socket.on('register', function(document) {
    // console.log("------------- register :: " + document.id)
    // Unpack the document
    var id = document.id;

    // Get a connection
    connection = backend.connect();
    // Get connection to document
    var doc = connection.get('documents', "" + id);
    // The doc
    doc.on('error', function(e) {
      // console.log(e)

      // Get a new document and subscribe
      doc = connection.get('documents', "" + id);
      doc.subscribe(function(e) {
        // console.log("------------------ subscribe")
      });

      // Deal with the ops
      doc.on('op', function(op) {
        // console.log("------------------ op")
        // console.log(doc.data)
        if(doc.data.text != text) {
          // console.log("------------------ op sent")
          socket.emit('editing', {id: id, text: doc.data.text});
        }
      })
    });

    // Attempt to fetch the doc
    doc.create({text:''});
  });
}

// Function start html express
function boot(port, context) {
  return new Promise((res, rej) => {
    co(function*() {
      // Create simple express application
      var app = express();

      // Create http server
      var server = require('http').createServer(app);

      // Create socket.io Connection
      var io = require('socket.io')(server);

      // Connect http server
      server.listen(port, function() {
        console.log('Server listening at port %d', port);
        // Resolve
        res({app: app, server: server, io: io});
      });

      // Add connect handler for socket.io
      io.on('connection', function (socket) {
        socketIOHandler(io, socket, context);
      });
    }).catch(rej);
  });
}

// Connection method
function connect(url, options) {
  return new Promise((res, rej) => {
    co(function*() {
      // Get the connection
      var db = yield MongoClient.connect(url, options);
      // Create instance of shared db
      var backend = ShareDB({db: require('sharedb-mongo')(url)});
      // Resolve with the values
      res({db: db, backend: backend});
    }).catch(rej);
  });
}

/*
 * Set up the context
 */
co(function*() {
  // Connect sharedb and mongodb
  var context = yield connect(url, {});
  // Boot server
  var serverContext = yield boot(port, context);
}).catch(function(e) {
  console.log(e.stack);
});
