var express = require('express'),
  rewrite = require('express-urlrewrite');

// Create express application
var app = express()

// rewrite some url's to ensure we load the react.js application
// correctly
app.use(rewrite('/okr/*', '/dist/index.html'))
app.use(rewrite('/bundle.js', '/dist/bundle.js'))
app.use(rewrite('/', '/dist/index.html'))

app.use(express.static(__dirname))

// Listen to the server
app.listen(8080, function () {
  console.log('Server listening on http://localhost:8080, Ctrl+C to stop')
})
