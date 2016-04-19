"use strict"

var assert = require('assert'),
  co = require('co'),
  MongoBrowserClient = require('browser-mongodb').client.MongoClient,
  SocketIOClientTransport = require('browser-mongodb').client.SocketIOTransport,
  Server = require('../server'),
  ioClient = require('socket.io-client');

describe('OKR', function() {
  describe('API', function() {
    it('retrieve a OKR', function(done) {
      co(function*() {
        // Create a server
        var server = new Server({url: 'mongodb://localhost:27017/test_okr', port: 9090});

        // Start a server
        yield server.start();

        //
        // Client connection
        //
        var client = new MongoBrowserClient(new SocketIOClientTransport(ioClient.connect, {}));

        // Create an instance
        try {
          // Attempt to connect
          var connectedClient = yield client.connect('http://localhost:9090');
        } catch(e) {
          console.log(e)
        }

        // Stop the server
        yield server.stop();

        // All done
        done();
      }).catch((e) => {
        console.log(e.stack);
      });
    });
  });
});
