"use strict"

import Store from './constants';
import co from 'co';

var fakeState = {
  edit: false,
  rate: true,
  objectives: [{
    id: 1,
    objective: 'objective 1',
    tags: ['core'],

    keyResults: [{
      id: 5,
      completeness: 45,
      keyResult: 'first key result',
      tags: ['mandatory']
    }, {
      id: 6,
      completeness: 15,
      keyResult: 'second key result'
    }]
  }],
  auth: [{
    rights: ['edit'],
    username: 'ole'
  }]
}

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
        console.log("!!!!!!!!! fetch okr")
        console.log(okr)
        // Resolve the user
        resolve(new OKR(okr));
      }).catch(reject);
    });
  }
}

class OKR {
  constructor(state) {
    this.state = state;
  }

  get objectives() {
    return this.state.objectives ? this.state.objectives : [];
  }

  // dispatch(action) {
  //   return new Promise((resolve, reject) => {
  //     if(action.type == Store.OKR_EDIT_BUTTON_CLICKED) {
  //       this.state.edit = action.value == 1;
  //     } else if(action.type == Store.OKR_CHANGED) {
  //       // Update objectives
  //       this.state.objectives = action.value.type == 'objectiveChange'
  //         ? objectiveChanged(this.state, action.value)
  //         : keyResultChanged(this.state, action.value);
  //     } else if(action.type == Store.OKR_RATING_CHANGED) {
  //       this.state.objectives = keyResultRatingChanged(this.state,
  //         action.value.objectiveId,
  //         action.value.keyResultId, action.value.value)
  //     }
  //
  //     resolve();
  //   });
  // }
  //
  // canEdit() {
  //   // Current viewer yet
  //   if(!this.currentViewingUser) return false;
  //   // Is the viewing user and admin
  //   if(this.currentViewingUser.role == 'admin') return true;
  //   // Is the viewing user the same as the okr owner
  //   if(this.currentViewingUser.username == this.userId) return true;
  //   // Not an admin validate if the user is the
  //   if(this.state.auth) {
  //     // Iterate over all the array entries
  //     for(var auth of this.state.auth) {
  //       if(auth.username == this.userId) {
  //         if(auth.rights && auth.rights.indexOf('edit') != -1) return true;
  //       }
  //     }
  //   }
  //
  //   return false;
  // }
}
