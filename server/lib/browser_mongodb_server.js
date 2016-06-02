"use strict"

var BrowserMongoDBServer = require('browser-mongodb').Server,
  SocketIOTransport = require('browser-mongodb').SocketIOTransport,
  co = require('co');

// Custom commands
var CurrentUserCommand = require('./commands/current_user');

class Server {
  constructor(db, options) {
    this.db = db;
    this.options = options || {};
  }

  connect(httpServer) {
    var self = this;

    // Return a promise
    return new Promise((resolve, reject) => {
      co(function*() {
        // Create the browser server
        self.server = new BrowserMongoDBServer(self.db, self.options);

        // Register current user command
        self.server.registerCommand('currentUser', CurrentUserCommand.schema, new CurrentUserCommand());

        // Create socket transport
        self.socketTransport = new SocketIOTransport(httpServer);
        // Add a socket transport
        self.server.registerTransport(self.socketTransport);
        // Get the channel
        self.channel = yield self.server.createChannel('mongodb');

        // Add a before handler
        self.channel.before(function(conn, channel, data, callback) {
          callback();
        });

        resolve(self.socketTransport.io);
      }).catch(reject);
    });
  }

  destroy() {
    var self = this;

    return new Promise((resolve, reject) => {
      self.server.destroy();
      resolve();
    });
  }
}

module.exports = Server;
