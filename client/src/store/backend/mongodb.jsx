"use strict"

import co from 'co';
import {MongoClient, SocketIOTransport} from 'browser-mongodb/client';
import ioClient from 'socket.io-client';

const DISCONNECTED = 0;
const CONNECTING = 1;
const CONNECTED = 2;

var handleReject = function(reject) {
  return function(err) {
    console.log("------------------------ error in MongoDB Backend provider")
    console.log(err.stack)
    reject(err);
  }
}

export default class MongoDBBackend {
  connect(url) {
    var self = this;
    url = url || 'http://localhost:9090';
    this.state = CONNECTING;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Client connection
        var client = new MongoClient(new SocketIOTransport(ioClient.connect, {}));
        // Attempt to connect
        self.client = yield client.connect(url);
        // Set connected state
        self.state = CONNECTED;
        // Resolve
        resolve(self);
      }).catch(function(e) {
        self.state = DISCONNECTED;
        reject(e);
      });
    });
  }

  isConnected() {
    return this.client && this.client.isConnected();
  }

  loadCurrent() {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Have the server send us the currently logged in user
        var user = yield self.client
          .db('okr')
          .command({currentUser: true});
        // Resolve the user
        resolve(user);
      }).catch(handleReject(reject));
    });
  }

  loadUser(username) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Grab the user from the server
        var user = yield self.client
          .db('okr')
          .collection('users')
          .find({username: username})
          .limit(1).next();
        // Resolve the user
        resolve(user);
      }).catch(handleReject(reject));
    });
  }
}
