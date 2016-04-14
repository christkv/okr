"use strict"

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

var fakeTagsState = {
  tags: [
    {id:1, text: 'mandatory'},
    {id:2, text: 'core'},
    {id:3, text: 'driver'}
  ]
}

var fakeUserState = {
  role: 'admin', name: 'peter robin', username: 'ole'
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

class OKRState {
  constructor() {
    this.state = {
      objectives: [],
      edit:false,
      addTagData: {},
      addTagIsOpen: false,
      addObjectiveIsOpen: false,
      addKeyResultIsOpen: false
    };
  }

  getState() {
    return this.state;
  }

  canRate() {
    // Current viewer yet
    if(!this.currentViewingUser) return false;
    // Is the viewing user the same as the okr owner
    if(this.currentViewingUser.getUsername() == this.userId) return true;
    // Cannot rate
    return false;
  }

  canEdit() {
    // Current viewer yet
    if(!this.currentViewingUser) return false;
    // Is the viewing user and admin
    if(this.currentViewingUser.getRole() == 'admin') return true;
    // Is the viewing user the same as the okr owner
    if(this.currentViewingUser.getUsername() == this.userId) return true;
    // Not an admin validate if the user is the
    if(this.state.auth) {
      // Iterate over all the array entries
      for(var auth of this.state.auth) {
        if(auth.username == this.userId) {
          if(auth.rights && auth.rights.indexOf('edit') != -1) return true;
        }
      }
    }

    return false;
  }

  load(userId, currentViewingUser) {
    return new Promise((resolve, reject) => {
      // Set up the state
      this.state = fakeState;
      // Current user OKR id
      this.userId = userId;
      // Set the current viewing user
      this.currentViewingUser = currentViewingUser;
      // Resolve
      resolve();
    });
  }

  dispatch(action) {
    return new Promise((resolve, reject) => {
      if(action.type == Store.OKR_EDIT_BUTTON_CLICKED) {
        this.state.edit = action.value == 1;
      } else if(action.type == Store.OKR_CHANGED) {
        // Update objectives
        this.state.objectives = action.value.type == 'objectiveChange'
          ? objectiveChanged(this.state, action.value)
          : keyResultChanged(this.state, action.value);
      } else if(action.type == Store.OKR_RATING_CHANGED) {
        console.log("------------------------------------------")
        console.log(action)

        this.state.objectives = keyResultRatingChanged(this.state,
          action.value.objectiveId,
          action.value.keyResultId, action.value.value)
      }

      resolve();
    });
  }
}

class UserStore {
  constructor(state) {
    this.state = state || {};
  }

  getRole() {
    return this.state.role;
  }

  getUsername() {
    return this.state.username;
  }

  load(user) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        self.state = fakeUserState;
        resolve(!user ? self : new UserStore(fakeUserState));
      }).catch(reject);
    });
  }
}

class TagsStore {
  constructor() {
    this.state = {tags: []};
  }

  load() {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        self.state = fakeTagsState;
        resolve(self);
      }).catch(reject);
    });
  }

  tags() {
    return this.state.tags;
  }
}

export default class Store {
  constructor() {
    this.okr = new OKRState();
    this.user = new UserStore();
    this.tags = new TagsStore();
  }

  OKR() {
    return this.okr;
  }

  User() {
    return this.user;
  }

  Tags() {
    return this.tags;
  }
}

Store.OKR_EDIT_BUTTON_CLICKED = 'OKR_EDIT_BUTTON_CLICKED';
Store.OKR_CHANGED = 'OKR_CHANGED';
Store.OKR_RATING_CHANGED = 'OKR_RATING_CHANGED';
