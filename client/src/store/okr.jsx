"use strict"

import Store from './constants';
import co from 'co';

// Handle objective text changed
var objectiveChanged = function(state, change) {
  return state.objectives.map((objective) => {
    if(objective._id == change.objectiveId) {
      objective.objective = change.value;
      objective.modified = true;
    }

    return objective;
  });
}

// Handle key result text changed
var keyResultChanged = function(state, change) {
  return state.objectives.map(function(objective) {
    if(objective._id == change.objectiveId) {
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
    if(objective._id == objectiveId) {
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

  loadOKRs(ids) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Load a user by userId
        var okr = yield self.backend.loadOKRByIds(ids);
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
        yield self.backend.addOKRKeyResult(objectiveId, keyResult);
        // Resolve
        resolve();
      }).catch(reject);
    });
  }

  deleteKeyResult(objectiveId, keyResultId) {
    return this.backend.deleteKeyResult(objectiveId, keyResultId);
  }

  deleteObjective(objectiveId) {
    return this.backend.deleteObjective(objectiveId);
  }

  updateKeyResultTags(objectiveId, keyResultId, tags) {
    return this.backend.updateKeyResultTags(objectiveId, keyResultId, tags);
  }

  updateObjectiveTags(objectiveId, tags) {
    return this.backend.updateObjectiveTags(objectiveId, tags);
  }

  searchAll(searchTerm) {
    return this.backend.searchAll(searchTerm);
  }

  linkKeyResult(objectiveId, keyResultId, linkObjectiveId, linkKeyResultId) {
    return this.backend.linkKeyResult(objectiveId, keyResultId, linkObjectiveId, linkKeyResultId);
  }

  linkObjective(objectiveId, linkObjectiveId, linkKeyResultId) {
    return this.backend.linkObjective(objectiveId, linkObjectiveId, linkKeyResultId);
  }
}

/*
 * OKR Method
 */
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
          username: self.state.username,
          tags: [],
          keyResults: []
        });

        resolve();
      }).catch(reject);
    });
  }

  deleteKeyResult(objectiveId, keyResultId) {
    return this.store.deleteKeyResult(objectiveId, keyResultId);
  }

  deleteObjective(objectiveId) {
    return this.store.deleteObjective(objectiveId)
  }

  updateKeyResultTags(objectiveId, keyResultId, tags) {
    return this.store.updateKeyResultTags(objectiveId, keyResultId, tags);
  }

  updateObjectiveTags(objectiveId, tags) {
    return this.store.updateObjectiveTags(objectiveId, tags);
  }

  linkKeyResult(objectiveId, keyResultId, linkObjectiveId, linkKeyResultId) {
    return this.store.linkKeyResult(objectiveId, keyResultId, linkObjectiveId, linkKeyResultId);
  }

  linkObjective(objectiveId, linkObjectiveId, linkKeyResultId) {
    return this.store.linkObjective(objectiveId, linkObjectiveId, linkKeyResultId);
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

  searchAll(searchTerm) {
    return this.store.searchAll(searchTerm);
  }
}
