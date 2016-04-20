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
  constructor() {
    this.cache = {};
  }

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
        // Use cached user to avoid any non-needed roundtrips
        if(self.cache[username]) return resolve(username);
        // Grab the collections
        var users = self.client.db('okr').collection('users');
        var teams = self.client.db('okr').collection('teams');

        // console.log("-------------------------------------------- fetch user")
        // Grab the user from the server
        var user = yield users
          .find({username: username})
          .limit(1).next();
        if(!user) return reject(new Error(`user with id ${username} not found`));
        // console.log("-------------------------------------------- resolve managers")
        // Resolve users
        user.managers = yield users
          .find({username: {$in: user.managers || []}}).toArray();

        // console.log("-------------------------------------------- resolve teams")
        // Resolve the teams the user is in
        if(user.teams && user.teams.in) {
          // console.log({username: {$in: user.teams.in}})
          user.teams.in = yield teams
            .find({username: {$in: user.teams.in}}).toArray();
            // console.log("-------------------------------------------- resolve teams")
            // console.log(user.teams.in)

          // Resolve all the team members information
          for(var i = 0; i < user.teams.in.length; i++) {
            user.teams.in[i].members = yield users
              .find({username: {$in: user.teams.in[i].members}}).toArray();
          }
        }

        // console.log("-------------------------------------------- resolve managers")
        // Resolve the teams the user manages if any
        if(user.teams && user.teams.manages) {
          user.teams.manages = yield teams
            .find({username: {$in: user.teams.manages}}).toArray();

          // Resolve all the team members information
          for(var i = 0; i < user.teams.manages.length; i++) {
            user.teams.manages[i].members = yield sers
              .find({username: {$in: user.teams.manages[i].members}}).toArray();
          }
        }

        // console.log("-------------------------------------------- all resolved")
        // console.log(JSON.stringify(user))
        // console.log(user)

        // Add user to cache
        self.cache[username] = user;

        // Resolve the user
        resolve(user);
      }).catch(handleReject(reject));
    });
  }
}
