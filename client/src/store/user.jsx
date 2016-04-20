"use strict"

import Store from './constants';
import co from 'co';

var fakeUserState = {
  role: 'admin', name: 'peter robin', username: 'ole'
}

export default class Users {
  constructor(backend) {
    this.backend = backend;
    this.state = {};
  }

  load(username) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // console.log("-------------------------------- loadUser 0")

        // Load a user by userId
        var user = yield self.backend.loadUser(username);
        if(user == null) return reject(new Error(`failed to locate user {username}`));
        // console.log("-------------------------------- loadUser 1")
        // console.log(user)
        // Resolve the user
        resolve(new User(user));
      }).catch(reject);
    });
  }

  loadCurrent() {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // console.log("-------------------------------- loadCurrent 0")
        // Load a user by userId
        var user = yield self.backend.loadCurrent();
        if(user == null) return reject(new Error('failed to locate current user'));
        // console.log("-------------------------------- loadCurrent 1")
        // console.log(user)
        // Resolve the user
        resolve(new User(user.user));
      }).catch(reject);
    });
  }
}

class User {
  constructor(state) {
    this.state = state || {};
  }

  get name() {
    return this.state.name;
  }

  get title() {
    return this.state.title;
  }

  get team() {
    return this.state.team;
  }

  get managers() {
    return this.state.manager;
  }

  get reports() {
    return this.state.reports;
  }

  get avatar() {
    return this.state.avatar;
  }

  get username() {
    return this.state.username;
  }

  get role() {
    if(Array.isArray(this.state.roles) && this.state.roles.length > 0) {
      return this.state.roles[0];
    }

    return 'user';
  }
}
