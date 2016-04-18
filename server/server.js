"use strict";

var express = require('express'),
  co = require('co'),
  CollaborationServer = require('./lib/collaboration_server'),
  MongoClient = require('mongodb').MongoClient;

// Settings
var url = 'mongodb://localhost:27017/okr';
var port = 8080;

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
        context.collaborationServer.handleSocket(socket);
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
      var server = yield new CollaborationServer(url).connect();
      // Resolve with the values
      res({db: db, collaborationServer: server});
    }).catch(rej);
  });
}

/*
 * Set up the context
 */
co(function*() {
  // Connect sharedb and mongodb
  var context = yield connect(url, {});
  // Drop the db
  yield context.db.dropDatabase();
  // Boot server
  var serverContext = yield boot(port, context);
}).catch(function(e) {
  console.log(e.stack);
});
