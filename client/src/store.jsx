"use strict"

import co from 'co';
import OKRStore from './store/okr';
import UserStore from './store/user';
import TagStore from './store/tag';
import CommentStore from './store/comment';
import MongoDBBackend from './store/backend/mongodb';
import SearchStore from './store/search';

export default class Store {
  constructor(backend) {
    // Either use the provided backend or the default MongoDB backend
    // Allows for passing in a mock backend for testing purposes
    this.backend = backend || new MongoDBBackend();
    // Create the stores
    this.okr = new OKRStore(this.backend);
    this.user = new UserStore(this.backend);
    this.tags = new TagStore(this.backend);
    this.comment = new CommentStore(this.backend);
    this.search = new SearchStore(this.backend);
  }

  connect(url) {
    var self = this;
    url = url || 'http://localhost:9090';

    return new Promise((resolve, reject) => {
      co(function*() {
        // Only connect if not already connected
        if(!self.backend.isConnected()) {
          yield self.backend.connect(url)
        }

        // Resolve
        resolve(self);
      }).catch(reject);
    });
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

  Comment() {
    return this.comment;
  }

  Search() {
    return this.search;
  }
}
