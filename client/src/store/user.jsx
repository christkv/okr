"use strict"

import co from 'co';

export default class Store {
  constructor(backend) {
    this.backend = backend;
  }

  load(username) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Load a user by userId
        var user = yield self.backend.loadUser(username);
        if(user == null) return reject(new Error(`failed to locate user {username}`));
        // Resolve the user
        resolve(new User(user));
      }).catch(reject);
    });
  }

  loadCurrent() {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Load a user by userId
        var user = yield self.backend.loadCurrent();
        if(user == null) return reject(new Error('failed to locate current user'));
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

  get teams() {
    return this.state.reporting && this.state.reporting.teams
      ? this.state.reporting.teams
      : [];
  }

  get managers() {
    return this.state.reporting && this.state.reporting.managers
      ? this.state.reporting.managers
      : [];
  }

  get reports() {
    return this.state.reporting
      && this.state.reporting.manages && this.state.reporting.manages.people
        ? this.state.reporting.manages.people
        : [];
  }

  get managedTeams() {
    return this.state.reporting
      && this.state.reporting.manages && this.state.reporting.manages.teams
        ? this.state.reporting.manages.teams
        : [];
  }

  get avatar() {
    return this.state.avatar;
  }

  get username() {
    return this.state.username;
  }

  get id() {
    return this.state._id.toString();
  }

  get role() {
    if(Array.isArray(this.state.roles) && this.state.roles.length > 0) {
      return this.state.roles[0];
    }

    return 'user';
  }
}
