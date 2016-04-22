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

  loadOKR(username, currentViewingUser) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        console.log("------------------------------------ loadOKR")
        console.log(username)
        console.log(currentViewingUser)

        // Grab the collections
        var okrs = self.client.db('okr').collection('okrs');

        // Have the server send us the currently logged in user
        var okr = yield okrs
          .find({username: username, active: true})
          .limit(1).next();
        if(!okr) return reject(new Error(`could not locate active okr for user ${username}`));
        // Resolve the user
        resolve(okr);
      }).catch(handleReject(reject));
    });
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
        // Grab the collections
        var users = self.client.db('okr').collection('users');
        var teams = self.client.db('okr').collection('teams');

        // Grab the user from the server
        var user = yield users
          .find({username: username})
          .limit(1).next();
        if(!user) return reject(new Error(`user with id ${username} not found`));

        if(user.reporting && user.reporting.managers) {
          // Resolve users
          user.reporting.managers = yield users
            .find({username: {$in: user.reporting.managers || []}}).toArray();
        }

        // Resolve the teams the user is in
        if(user.reporting && user.reporting.teams) {
          // console.log({username: {$in: user.teams.in}})
          user.reporting.teams = yield teams
            .find({username: {$in: user.reporting.teams}}).toArray();

          // Resolve all the team members information
          for(var i = 0; i < user.reporting.teams.length; i++) {
            user.reporting.teams[i].members = yield users
              .find({username: {$in: user.reporting.teams[i].members}}).toArray();
          }
        }

        // Resolve the people the user manages if any
        if(user.reporting
          && user.reporting.manages
          && user.reporting.manages.people) {

          // Resolve users
          user.reporting.manages.people = yield users
            .find({username: {$in: user.reporting.manages.people || []}}).toArray();
        }

        // Resolve the teams the user manages if any
        if(user.reporting
          && user.reporting.manages
          && user.reporting.manages.teams) {

          // Resolve the teams
          user.reporting.manages.teams = yield teams
            .find({username: {$in: user.reporting.manages.teams}}).toArray();

          // Resolve all the team members information
          for(var i = 0; i < user.reporting.manages.teams.length; i++) {
            user.reporting.manages.teams[i].members = yield users
              .find({username: {$in: user.reporting.manages.teams[i].members}}).toArray();
          }
        }

        // Resolve the user
        resolve(user);
      }).catch(handleReject(reject));
    });
  }
}
