"use strict"

import Actions from './constants';
import co from 'co';

export default class Store {
  constructor(backend) {
    this.backend = backend;
  }

  loadObjectiveComments(ids) {
    var self = this;
    console.log("--- comments :: loadObjectiveComments :: 0")
    console.log(ids)

    return new Promise((resolve, reject) => {
      co(function*() {
        console.log("--- comments :: loadObjectiveComments :: 1")
        var objectiveIds = Array.isArray(ids) ? ids : [ids];
        console.log(objectiveIds)
        // Load a user by userId
        var comments = yield self.backend.loadObjectiveComments(objectiveIds);
        console.log("--- comments :: loadObjectiveComments :: 2")
        // Resolve the user
        resolve(comments.map(function(comment) {
          return new Comment(self.backend, comment);
        }));
      }).catch(reject);
    });
  }

  loadComments(ids) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        var objectiveIds = Array.isArray(ids) ? ids : [ids];
        // Load a user by userId
        var comments = yield self.backend.loadComments(objectiveIds);
        // Resolve the user
        resolve(comments.map(function(comment) {
          return new Comment(self.backend, comment);
        }));
      }).catch(reject);
    });
  }

  addComment(from, message, tags) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Load a user by userId
        yield self.backend.addComment(from, message, tags);
        // Resolve the user
        resolve();
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

  updateComment(commentId, text) {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Load a user by userId
        yield self.backend.updateComment(commentId, text);
        // Resolve the user
        resolve();
      }).catch(reject);
    });
  }

  deleteComment(commentId) {
    var self = this;
    console.log("== Comment deleteComment 0")

    return new Promise((resolve, reject) => {
      co(function*() {
        console.log("== Comment deleteComment 1")
        // Load a user by userId
        yield self.backend.deleteComment(commentId);
        console.log("== Comment deleteComment 2")
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
