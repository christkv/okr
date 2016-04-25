"use strict"

import co from 'co';
import {MongoClient, SocketIOTransport, ObjectId} from 'browser-mongodb/client';
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
    this.db = null;
    this.tags = null;
    this.okrs = null;
    this.users = null;
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
        // Get the collections
        self.db = self.client.db('okr');
        self.tags = self.db.collection('tags');
        self.okrs = self.db.collection('okrs');
        self.users = self.db.collection('users');
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

  /*
   * OKR Methods
   */
  loadOKRById(id) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Have the server send us the currently logged in user
        var okr = yield self.okrs
          .find({_id: id})
          .limit(1).next();
        if(!okr) return reject(new Error(`could not locate active okr for ${id}`));
        // Resolve the user
        resolve(okr);
      }).catch(handleReject(reject));
    });
  }

  loadOKR(username, currentViewingUser) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Have the server send us the currently logged in user
        var okr = yield self.okrs
          .find({username: username, active: true})
          .limit(1).next();
        if(!okr) return reject(new Error(`could not locate active okr for user ${username}`));
        // Resolve the user
        resolve(okr);
      }).catch(handleReject(reject));
    });
  }

  loadTags() {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Have the server send us the currently logged in user
        var results = yield self.tags
          .find({})
          .toArray();
        // Resolve the user
        resolve(results);
      }).catch(handleReject(reject));
    });
  }

  addOKRObjective(id, objective) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Add id to objective if none exits
        if(!objective.id) objective.id = new ObjectId();

        // Have the server send us the currently logged in user
        var result = yield self.okrs
          .updateOne({_id: id}, {$push: {objectives: objective}});
        if(result.modifiedCount == 0) {
          return reject(new Error(`failed to add objective to okr with id ${id}`))
        }
        // Resolve the user
        resolve(result);
      }).catch(handleReject(reject));
    });
  }

  addOKRKeyResult(id, objectiveId, keyResult) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Add id to objective if none exits
        if(!keyResult.id) keyResult.id = new ObjectId();

        // Have the server send us the currently logged in user
        var result = yield self.okrs
          .updateOne({
            _id: id, 'objectives.id': objectiveId
          }, {
            $push: {'objectives.$.keyResults': keyResult}
          });

        if(result.modifiedCount == 0) {
          return reject(new Error(`could not locate objective with id ${objectiveId}`))
        }
        // Resolve the user
        resolve(result);
      }).catch(handleReject(reject));
    });
  }

  deleteKeyResult(id, objectiveId, keyResultId) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Have the server send us the currently logged in user
        var result = yield self.okrs
          .updateOne({
            _id: id, 'objectives.id': objectiveId
          }, {
            $pull: {'objectives.$.keyResults': {id: keyResultId}}
          });

        // No modification happened the key result does not exist
        if(result.modifiedCount == 0) {
          return reject(new Error(`could not locate key result with id ${keyResultId}`))
        }

        // Resolve the user
        resolve(result);
      }).catch(reject);
    });
  }

  deleteObjective(id, objectiveId) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Have the server send us the currently logged in user
        var result = yield self.okrs
          .updateOne({
            _id: id
          }, {
            $pull: {'objectives': {id: objectiveId}}
          });

        // No modification happened the objective does not exist
        if(result.modifiedCount == 0) {
          return reject(new Error(`could not locate objective with id ${objectiveId}`))
        }
        // Resolve the user
        resolve(result);
      }).catch(reject);
    });
  }

  /*
   * User Methods
   */
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
