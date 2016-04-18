"use strict"

var MongoClient = require('mongodb'),
  ShareDB = require('sharedb'),
  co = require('co');

class CollaborationServer {
  constructor(url) {
    this.url = url;
  }

  connect() {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Create backend for shareDB
        self.backend = ShareDB({db: require('sharedb-mongo')(self.url)});
        // Resolve
        resolve(self);
      }).catch(reject);
    });
  }

  handleSocket(socket) {
    // Get the db and sharedb context
    var backend = this.backend;
    var connection = null;
    // Last update
    var text = null;

    // Editing event
    socket.on('editing', function(document) {
      // No connection, error out
      if(connection == null) {
        return socket.emit('error', { message: 'broken connection', code: 1});
      }

      // Get connection to document
      var doc = connection.get('documents', "" + document.id);

      // Set the text
      text = document.text;

      // Mange the operation types
      if(document.change && document.change.action == 'insert') {
        // Unpack the offsets and text
        var start = document.change.startOffset;
        var lines = document.change.lines;
        var line = lines[0];

        // Insert new line
        if(lines.length == 2 && lines[0] == '' && lines[1] == '') {
          line = '\n';
        };

        // Build jsonO operation
        // {p:PATH, t:'text0', o:[{p:OFFSET, i:TEXT}]}
        doc.submitOp({ p: ['text'], t: 'text0', o: [{p: start, i: line}] }, socket.id, function() {});
      } else if(document.change && document.change.action == 'remove') {
        var start = document.change.startOffset;
        var line = document.change.lines.join('\n');

        // console.log("############################################ remove")
        // console.log(line)

        // Build jsonO operation
        // {p:PATH, t:'text0', o:[{p:OFFSET, d:TEXT}]}
        doc.submitOp({ p: ['text'], t: 'text0', o: [{p: start, d: line}] }, socket.id, function() {});
      }
    });

    // Register event
    socket.on('register', function(document) {
      // Unpack the document
      var id = document.id;

      // Get a connection
      connection = backend.connect();

      // Get connection to document
      var doc = connection.get('documents', "" + id);

      // Attempt to create the document
      doc.create({text:''}, function(err) {
        // Get a new document and subscribe
        doc = connection.get('documents', "" + id);
        doc.subscribe(function(e) {
          // console.log("------------------ subscribe")
        });

        // Send initial document
        socket.emit('registered', { id: id, text: doc.data.text });

        // Deal with the ops
        doc.on('op', function(op, source) {
          if(source != socket.id) {
            // console.log("------------------ editing")
            // console.log(JSON.stringify(op, null, 2))

            socket.emit('editing', {id: id, text: doc.data.text, op: op[0]});
          }
        })
      });
    });
  }
}

module.exports = CollaborationServer;
