/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	api = require('./lib/api.js'),
	io = require ('socket.io');

var app = module.exports = express.createServer();


io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
}).listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


app.get('/data', function(req,res){
  api.Request({result:'geo', pagesize:50})
  .on('success', function(data){
    var activities = data['iati-activity'];

    //just send it straight to the client
    res.send(activities);

  }).end();
});

io.sockets.on('connection', function () {
});

io.sockets.on('echo', function (data) {
	socket.emit ('echo', {message: data});
});


app.listen(ps.env.PORT|| 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
