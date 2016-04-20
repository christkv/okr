"use strict"

var BrowserMongoDBServer = require('browser-mongodb').Server,
  SocketIOTransport = require('browser-mongodb').SocketIOTransport;

// Custom commands
var CurrentUserCommand = require('./commands/current_user');

class Server {
  constructor(db, options) {
    this.db = db;
    this.options = options || {};
  }

  connect(httpServer) {
    var self = this;
    // Create the browser server
    this.server = new BrowserMongoDBServer(this.db, this.options);

    // Register current user command
    this.server.registerCommand('currentUser', CurrentUserCommand.schema, new CurrentUserCommand());

    // Create socket transport
    this.socketTransport = new SocketIOTransport(httpServer);
    // Add a socket transport
    this.server.registerHandler(this.socketTransport);
    // Get the channel
    this.channel = this.server.channel('mongodb');

    // Add a before handler
    this.channel.before(function(conn, channel, data, callback) {
      callback();
    });

    // Return a promise
    return new Promise((resolve, reject) => {
      resolve(this.socketTransport.io);
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
