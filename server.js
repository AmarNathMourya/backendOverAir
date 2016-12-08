var express          =     require("express");
var mongo            =     require('mongodb');
var mongoose         =     require('mongoose');
var app              =     express();
var io               =     require("socket.io");
var cookieParser     =     require('cookie-parser');
var bodyParser       =     require('body-parser');
var fs               =     require('fs');
var cors             =     require('cors');
var config           =     require("./configs/config");
var controllerAdmn   =     require("./controllers/adminapp");
var controllerClint  =     require("./controllers/clientapp");

/* Creating connection.*/
mongoose.connect('mongodb://'+ config.MONGO_HOST +':'+ config.MONGO_PORT +'/'+ config.MONGO_DBNAME, function(err, database) {
  if(!err) {
    console.log("database connected successfully", config.MONGO_HOST, config.MONGO_PORT, config.MONGO_DBNAME);
  }
  else {
    console.log("database not connected");
  }
});
app.use("/",express.static(__dirname + '/public') );
app.use(cookieParser());
app.use(cors());
//Serve static files
app.use(express.static(__dirname + '/public/views'));
app.use(express.static(__dirname + '/public'));
app.use("/",express.static(__dirname + '/public/js/') );
app.use("/controllers", express.static(__dirname + '/controllers'));
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/images", express.static(__dirname + '/public/images'));
app.use("/config",express.static(__dirname + '/public/js/config') );

// app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb','extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json



var io          = require('socket.io').listen(app.listen(config.APP_PORT || process.env.PORT));
    // Load up the routers
var routers = require('./routes')(app, io, fs);


console.log('Magic happens on port: %d', config.APP_PORT || process.env.PORT );       // shoutout to the user
io.sockets.on('connection', function(socket){ 
  socket.on('channel2', function(bcon_id) {
    console.log("received bcon is:::", bcon_id);
    var condition = {'bcon_id': bcon_id}
    controllerAdmn.loadDataOnRefresh(condition, function(err, data) {
      console.log("all clients",data);
      if(!err) {
        socket.emit('connectedUserData',data);
      }
    })
  });

  //socket.on('channel3', )
  console.log('socket is running on port: 5000 ');

});
