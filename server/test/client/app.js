// Create socket.io
var socket = io('http://localhost:8080');

// boot up the ace editor
var editor = ace.edit("editor");
editor.$blockScrolling = Infinity;
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/markdown");

// Track changes
editor.on('change', function(change) {
  // console.log(JSON.stringify(change, null, 2))
  // Get the session
  var session = editor.getSession();
  // Get the document
  var document = session.getDocument();
  // Add offsets to the change event
  change.startOffset = document.positionToIndex(change.start, 0);
  // Updates not frozen
  if(!freezeChangeEvent) {
    socket.emit('editing', {id: 1, text: editor.getValue(), change: change});
  }
});

// Text
var freezeChangeEvent = false;

// Register the document by id
socket.emit('register', {
  id: 1,
  user: 'jane',
  name: 'Jane Robertson'
});

socket.on('registered', function(document) {
  // Set a flag to avoid looping updates
  freezeChangeEvent = true;
  // Update editor text
  editor.setValue(document.text);
  // Allow editing events to flow
  freezeChangeEvent = false;
});

// [
//   {
//     "p": [
//       "text"
//     ],
//     "t": "text0",
//     "o": [
//       {
//         "p": 0,
//         "i": "a"
//       }
//     ]
//   }
// ]
// app.js:48 [
//   {
//     "p": [
//       "text"
//     ],
//     "t": "text0",
//     "o": [
//       {
//         "p": 0,
//         "d": "a"
//       }
//     ]
//   }
// ]

// Add editing
socket.on('editing', function(document) {
  // Set a flag to avoid looping updates
  freezeChangeEvent = true;
  // Update editor text
  // console.log(JSON.stringify(document.op, null, 2))
  // editor.setValue(document.text);
  applyUpdate(editor.getSession(), document.op);
  // Allow editing events to flow
  freezeChangeEvent = false;
});

// {
//   "start": {
//     "row": 0,
//     "column": 0
//   },
//   "end": {
//     "row": 0,
//     "column": 1
//   },
//   "action": "insert",
//   "lines": [
//     "a"
//   ]
// }
// app.js:12 {
//   "start": {
//     "row": 0,
//     "column": 0
//   },
//   "end": {
//     "row": 0,
//     "column": 1
//   },
//   "action": "remove",
//   "lines": [
//     "a"
//   ]
// }

function applyUpdate(session, op) {
  // console.log(op)
  // Get the document
  var document = session.getDocument();
  // Convert the offset to a position
  var startPosition = document.indexToPosition(op.o[0].p, 0);
  var endPosition = null;
  var delta = null;

  // Insert or Remove operation
  if(op.o && op.o[0].i) {
    // console.log("!!!!!!!!!! insert")
    var endPosition = document.indexToPosition(op.o[0].p + op.o[0].i.length, 0);

    // Insert line
    var lines = [op.o[0].i];
    // Do we have a special character
    if(op.o[0].i == '\n') {
      lines = ['', ''];
    }

    // Build the delta
    delta = {
      start: { row: startPosition.row, column: startPosition.column },
      end: { row: endPosition.row, column: endPosition.column },
      action: 'insert',
      lines: lines
    }
  } else if(op.o && op.o[0].d) {
    // console.log("!!!!!!!!!! delete")
    var endPosition = document.indexToPosition(op.o[0].p + op.o[0].d.length, 0);
    // Build the delta
    delta = {
      start: { row: startPosition.row, column: startPosition.column },
      end: { row: endPosition.row, column: endPosition.column },
      action: 'remove',
      lines: [op.o[0].d]
    }
  }

  // Do we have a delta, apply it
  if(delta) {
    // console.log("------------------------- delta")
    // console.log(JSON.stringify(delta, null, 2))
    document.applyDeltas([delta]);
  }

  // console.log(JSON.stringify(delta, null, 2))
}
