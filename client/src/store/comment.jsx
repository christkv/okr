"use strict"

import Actions from './constants';
import co from 'co';

export default class Store {
  constructor(backend) {
    this.backend = backend;
  }

  loadObjectiveComments(objectiveId) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Load a user by userId
        var comments = yield self.backend.loadObjectiveComments(objectiveId);
        // Resolve the user
        resolve(comments.map(function(comment) {
          return new Comment(self.backend, comment);
        }));
      }).catch(reject);
    });
  }

  addCommentReply(from, message, tags) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Load a user by userId
        yield self.backend.addReply(from, message, tags);
        // Resolve the user
        resolve();
      }).catch(reject);
    });
  }

  updateReply(commentId, replyId, text) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Load a user by userId
        yield self.backend.updateReply(commentId, replyId, text);
        // Resolve the user
        resolve();
      }).catch(reject);
    });
  }

  deleteReply(commentId, replyId) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Load a user by userId
        yield self.backend.deleteReply(commentId, replyId);
        // Resolve the user
        resolve();
      }).catch(reject);
    });
  }
}

class Comment {
  constructor(backend, state) {
    this.backend = backend;
    this.state = state || {};
  }

  get id() { return this.state._id; }
  get _id() { return this.state._id; }
  get avatar() { return this.state.avatar; }
  get created() { return this.state.created; }
  get from() { return this.state.from; }
  get from_username() { return this.state.from_username; }
  get message() { return this.state.message; }
  get resolved() { return this.state.resolved; }
  get replies() {
    var replies = this.state.replies || [];
    return replies.map((reply) => {
      return new Reply(this, this.backend, reply);
    })
  }
}

class Reply {
  constructor(comment, backend, state) {
    this.backend = backend;
    this.state = state || {};
  }

  get id() { return this.state._id; }
  get _id() { return this.state._id; }
  get avatar() { return this.state.avatar; }
  get created() { return this.state.created; }
  get from() { return this.state.from; }
  get from_username() { return this.state.from_username; }
  get message() { return this.state.message; }
}
