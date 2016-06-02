"use strict";

var express = require('express'),
  co = require('co'),
  fs = require('fs'),
  CollaborationServer = require('./lib/collaboration_server'),
  MongoClient = require('mongodb').MongoClient,
  BrowserMongoDBServer = require('./lib/browser_mongodb_server'),
  session = require('express-session'),
  MongoDBStore = require('connect-mongodb-session')(session);

// Passport and google auth
var passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth20').Strategy;

// Parameters used
var dev = true;
var secret = 'This is a secret';
var organizations = ['10gen', 'mongodb'];
var credentials = require('./credentials.json');

function devExpressSetup(app) {
  var request = require('request');

  function extractProfile (profile) {
    var imageUrl = '';
    if (profile.photos && profile.photos.length) {
      imageUrl = profile.photos[0].value;
    }

    return {
      id: profile.id,
      displayName: profile.displayName,
      image: imageUrl,
      organizations: profile._json.organizations,
      profile: profile
    };
  }

  function validate(req, res) {
    console.log("!!!!!!!!!!!!!!! hey")
    console.log("!req.user = " + !req.user)
    console.log("req.user && !req.session.authenticated = " + (req.user && !req.session.authenticated))
    console.log("req.user && !Array.isArray(req.user.organizations) = " + (req.user && !Array.isArray(req.user.organizations)))
    if(!req.user) return res.redirect('/');
    if(req.user && !req.session.authenticated) return res.redirect('/');
    if(req.user && !Array.isArray(req.user.organizations)) return res.redirect('/');

    // Are we a member of an allowed organization
    for(var i = 0; i < req.user.organizations.length; i++) {
      if(organizations.indexOf(req.user.organizations[i].name) != -1) {
        return true;
      }
    }

    return false;
  }

  // Setup passport to handle sessions
  app.use(passport.initialize());
  app.use(passport.session());

  // Setup passport
  passport.use(new GoogleStrategy({
    clientID: credentials.installed.client_id,
    clientSecret: credentials.installed.client_secret,
    callbackURL: credentials.installed.redirect_uris[0],
    accessType: 'offline'
  }, function (accessToken, refreshToken, profile, cb) {
    // // if(!inValidOrganization)
    // return cb(new Error("FAILED"));
    // console.dir(profile)
    // Extract the minimal profile information we need from the profile object
    // provided by Google
    cb(null, extractProfile(profile));
  }));

  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });

  // Check if we are logged in
  app.get('/', (req, res) => {
    console.log("-------------------- /")
    if(req.user && req.session.authenticated) {
      return request('http://localhost:8080/', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          res.end(body);
        }
      })
    }

    // Redirect to auth
    res.redirect('/auth/google');
  });

  app.get('/auth/logout', (req, res) => {
    console.log("-------------------- /auth/logout")
    // Destroy session
    req.session.destroy(function(e){
      req.logout();
      res.redirect('/');
    });
  });

  app.get('/auth/google', passport.authenticate('google', {scope: ['profile']}), (req, res) => {
    console.log("-------------------- /auth/google")
    res.end();
  });

  // Forward
  app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    console.log("-------------------- /auth/google/callback")
    // Clean up session
    delete req.session.oauth2return;
    // Set the authenticated flag on the session
    req.session.authenticated = true;
    // Redirect to front page again
    res.redirect('/');
  });

  // Forward
  app.get('/bundle.js', (req, res) => {
    console.log("-------------------- /bundle.js")
    if(!validate(req, res)) return;
    request('http://localhost:8080/bundle.js', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.end(body);
      }
    })
  });

  app.get('*', (req, res) => {
    console.log("-------------------- * :: " + req.url)
    if(!validate(req, res)) return;
    request('http://localhost:8080/', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.end(body);
      }
    })
  });
}

// Set up any express configuration
function expressSetup(app) {
  if(dev) return devExpressSetup(app);
  // // Set up expected production serving
  // app.get('/bundle.js', (req, res) => {
  //   fs.readFile(`${__dirname}/../frontend/dist/bundle.js`, 'utf8', (err, r) => {
  //     res.end(r);
  //   });
  // });
  //
  // app.get('*', (req, res) => {
  //   fs.readFile(`${__dirname}/../frontend/dist/index.html`, 'utf8', (err, r) => {
  //     res.end(r);
  //   });
  // });
}

// Function start html express
function boot(port, url, context) {
  return new Promise((res, rej) => {
    co(function*() {
      // Create simple express application
      var app = express();

      // Create a session store
      var sessionStore = new MongoDBStore({ uri: url, collection: 'sessions' });

      // Configure the session store
      app.use(require('express-session')({
           secret: secret,
           cookie: {
             maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
           },
           store: sessionStore,
           // Boilerplate options, see:
           // * https://www.npmjs.com/package/express-session#resave
           // * https://www.npmjs.com/package/express-session#saveuninitialized
           resave: true, saveUninitialized: true
         }));

      // Catch errors
      sessionStore.on('error', function(error) {
      //  assert.ifError(error);
      //  assert.ok(false);
      });

      // Create http server
      var server = require('http').createServer(app);

      // Set up the express aspects
      expressSetup(app);

      // Connect http server
      server.listen(port, function() {
        console.log('Server listening at port %d', port);
        // Resolve
        res({app: app, server: server});
      });

      // Attach the mongodb browser library but use the io socket for the
      // collaborationServer aswell
      var io = yield context.browserMongoDBServer.connect(server);

      // Add connect handler for socket.io
      io.on('connection', function (socket) {
        context.collaborationServer.handleSocket(socket);
      });

      res();
    }).catch(rej);
  });
}

// Connection method
function connect(url, options) {
  return new Promise((res, rej) => {
    co(function*() {
      // Get the connection
      var db = yield MongoClient.connect(url, options);
      // Create the needed indexes
      var r = yield db.collection('objectives').ensureIndex({objective: 'text'});
      r = yield db.collection('teams').ensureIndex({name: 'text'});
      r = yield db.collection('users').ensureIndex({name: 'text'});
      // Create instance of shared db
      var server = yield new CollaborationServer(url).connect();
      // Create a new instance of BrowserMongoDBServer
      var browserMongoDBServer = new BrowserMongoDBServer(db, {raw:true});
      // Resolve with the values
      res({db: db, collaborationServer: server, browserMongoDBServer: browserMongoDBServer});
    }).catch(rej);
  });
}

class Server {
  constructor(options) {
    options = options || {};
    this.url = options.url || 'mongodb://localhost:27017/okr';
    this.port = options.port || 8080;
  }

  start() {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Connect sharedb and mongodb
        self.context = yield connect(self.url, {
          db: { promoteLongs: false }
        });

        // // Drop the db
        // yield self.context.db.dropDatabase();

        // Boot server
        yield boot(self.port, self.url, self.context);
        resolve();
      }).catch(reject);
    });
  }

  stop() {
    var self = this;

    return new Promise((resolve, reject) => {
      co(function*() {
        // Shutdown sharedb
        yield self.context.collaborationServer.destroy();
        // Shutdown browser-mongodb
        yield self.context.browserMongoDBServer.destroy();
        // Close the db server
        self.context.db.close();
        resolve();
      }).catch(reject);
    });
  }
}

module.exports = Server;
