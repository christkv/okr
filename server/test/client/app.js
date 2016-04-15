// Create socket.io
var socket = io('http://localhost:8080');

// boot up the ace editor
var editor = ace.edit("editor");
editor.$blockScrolling = Infinity;
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/markdown");
editor.on('change', function(change) {
  // console.log("------------------------ change event")
  // console.log(change)
  // console.log(editor.getValue())
  if(!freezeChangeEvent) {
    socket.emit('editing', {id: 1, text: editor.getValue()});
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

socket.on('editing', function(document) {
  // Set a flag to avoid looping updates
  freezeChangeEvent = true;
  // Update editor text
  editor.setValue(document.text);
  // Allow editing events to flow
  freezeChangeEvent = false;
});
