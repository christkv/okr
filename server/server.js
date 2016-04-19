"use strict";

var express = require('express'),
  co = require('co'),
  CollaborationServer = require('./lib/collaboration_server'),
  MongoClient = require('mongodb').MongoClient,
  BrowserMongoDBServer = require('./lib/browser_mongodb_server');

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

      // Attach the mongodb server
      yield context.browserMongoDBServer.connect(server);

      // Add connect handler for socket.io
      io.on('connection', function (socket) {
        // Handle connection for collaborationServer
        context.collaborationServer.handleSocket(socket);
      });

      res();
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
      // Create a new instance of BrowserMongoDBServer
      var browserMongoDBServer = new BrowserMongoDBServer(db);
      // Resolve with the values
      res({db: db, collaborationServer: server, browserMongoDBServer: browserMongoDBServer});
    }).catch(rej);
  });
}

class Server {
  constructor(options) {
    options = options || {};
    this.url = options.url || 'mongodb://localhost:27017/okr';
    this.port = options.port || 8080;
  }

  start() {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Connect sharedb and mongodb
        self.context = yield connect(self.url, {
          db: { promoteLongs: false }
        });
        // Drop the db
        yield self.context.db.dropDatabase();
        // Boot server
        yield boot(self.port, self.context);
        resolve();
      }).catch(reject);
    });
  }

  stop() {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Shutdown sharedb
        yield self.context.collaborationServer.destroy();
        // Shutdown browser-mongodb
        yield self.context.browserMongoDBServer.destroy();
        // Close the db server
        self.context.db.close();
        resolve();
      }).catch(reject);
    });
  }
}

module.exports = Server;
