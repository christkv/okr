
"use strict";

var Server = require('./server'),
  co = require('co');

// Settings
var url = 'mongodb://localhost:27017/okr';
var port = 9090;

/*
 * Set up the context
 */
co(function*() {
  var server = new Server({
    url: url, port: port
  });

  // Boot server
  yield server.start();
}).catch(function(e) {
  console.log(e.stack);
});
