"use strict"

import co from 'co';

export default class Search {
  constructor(backend) {
    this.backend = backend;
  }

  searchTeamAndUsers(searchTerm) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Load a user by userId
        var results = yield self.backend.searchTeamAndUsers(searchTerm);
        // Resolve the user
        resolve(results);
        // Resolve the user
        resolve(results.map((r) => {
          r.toString = function() { return this.name };
          return r;
        }));
      }).catch(reject);
    });
  }
}
