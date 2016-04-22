"use strict";

var co = require('co');

class Command {
  constructor() {
  }

  handle(connection, mongoClient, bson, originalOp, op, liveQueryHandler, options) {
    return new Promise((resolve, reject) => {
      co(function*() {
        //
        // TODO Fix this to make it work correctly instead of returning the first user
        // available.
        //

        // Load the fake current user
        var user = yield mongoClient.db('okr').collection('users').findOne({username:'ole'});
        // Resolve the entry
        resolve({ ok: true, user: user});
      }).catch(reject);
    });
  }
}

Command.schema = {
  "properties": {
    "currentUser": { "type": "boolean" }
  },
  "required": ["currentUser"]
};

module.exports = Command;
