"use strict"

import co from 'co';

var fakeState = {
  edit:false,
  objectives: [{
    id: 1,
    objective: 'objective 1',

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

class OKRState {
  constructor() {
    this.state = {objectives: [], edit:false, modalData: {}, modalIsOpen: false};
  }

  getState() {
    return this.state;
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

var user = new UserStore();
var okr = new OKRState();
var tags = new TagsStore();

export default class Store {
  constructor() {
  }

  static OKR() {
    return okr;
  }

  static User() {
    return user;
  }

  static Tags() {
    return tags;
  }
}

Store.OKR_EDIT_BUTTON_CLICKED = 'OKR_EDIT_BUTTON_CLICKED';
Store.OKR_CHANGED = 'OKR_CHANGED';
