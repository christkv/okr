"use strict"

import Store from './constants';
import co from 'co';

// Handle objective text changed
var objectiveChanged = function(state, change) {
  return state.objectives.map((objective) => {
    if(objective.id == change.objectiveId) {
      objective.objective = change.value;
      objective.modified = true;
    }

    return objective;
  });
}

// Handle key result text changed
var keyResultChanged = function(state, change) {
  return state.objectives.map(function(objective) {
    if(objective.id == change.objectiveId) {
      objective.keyResults = objective.keyResults.map((keyResult) => {
        if(keyResult.id == change.keyResultId) {
          keyResult.keyResult = change.value;
          keyResult.modified = true;
        }

        return keyResult;
      });
    }

    return objective;
  })
}

// Update the keyResult rating
var keyResultRatingChanged = function(state, objectiveId, keyResultId, value) {
  return state.objectives.map(function(objective) {
    if(objective.id == objectiveId) {
      objective.keyResults = objective.keyResults.map((keyResult) => {
        if(keyResult.id == keyResultId) {
          keyResult.completeness = value;
        }

        return keyResult;
      });
    }

    return objective;
  })
}

export default class OKRs {
  constructor(backend) {
    this.backend = backend;
  }

  getState() {
    return this.state;
  }

  canRate() {
    // Current viewer yet
    if(!this.currentViewingUser) return false;
    // Is the viewing user the same as the okr owner
    if(this.currentViewingUser.username == this.userId) return true;
    // Cannot rate
    return false;
  }

  load(user, currentViewingUser) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Load a user by userId
        var okr = yield self.backend.loadOKR(user.username, currentViewingUser.username);
        // Resolve the user
        resolve(new OKR(self, okr));
      }).catch(reject);
    });
  }

  loadOKR(id) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Load a user by userId
        var okr = yield self.backend.loadOKRById(id);
        // Resolve the user
        resolve(okr);
      }).catch(reject);
    });
  }

  addNewObjective(id, objective) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Add new objective to okr
        yield self.backend.addOKRObjective(id, objective);
        // Resolve
        resolve();
      }).catch(reject);
    });
  }

  addNewKeyResult(id, objectiveId, keyResult) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Add new objective to okr
        yield self.backend.addOKRKeyResult(id, objectiveId, keyResult);
        // Resolve
        resolve();
      }).catch(reject);
    });
  }

  deleteKeyResult(id, objectiveId, keyResultId) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Delete the key result
        yield self.backend.deleteKeyResult(id, objectiveId, keyResultId);
        // Resolve
        resolve();
      }).catch(reject);
    });
  }

  deleteObjective(id, objectiveId) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Delete the key result
        yield self.backend.deleteObjective(id, objectiveId);
        // Resolve
        resolve();
      }).catch(reject);
    });
  }
}

class OKR {
  constructor(store, state) {
    this.store = store;
    this.state = state;
  }

  get objectives() {
    return this.state.objectives ? this.state.objectives : [];
  }

  addNewKeyResult(objectiveId, text) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        yield self.store.addNewKeyResult(self.state._id, objectiveId, {
          keyResult: text,
          tags: [],
          completeness: 0
        });

        resolve();
      }).catch(reject);
    });
  }

  addNewObjective(text) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        yield self.store.addNewObjective(self.state._id, {
          objective: text,
          tags: [],
          keyResults: []
        });

        resolve();
      }).catch(reject);
    });
  }

  deleteKeyResult(objectiveId, keyResultId) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Delete the key result
        yield self.store.deleteKeyResult(self.state._id, objectiveId, keyResultId);
        // Resolve
        resolve();
      }).catch(reject);
    });
  }

  deleteObjective(objectiveId) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Delete the key result
        yield self.store.deleteObjective(self.state._id, objectiveId);
        // Resolve
        resolve();
      }).catch(reject);
    });
  }

  reload() {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Reload the store
        self.state = yield self.store.loadOKR(self.state._id);
        // Resolve it
        resolve(self);
      }).catch(reject);
    });
  }
}
