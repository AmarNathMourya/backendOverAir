'use strict';


var commonModel    = require('../models/commonmodel');
var adminModel    = require('../models/adminmodel');
var url            = require('url');


//*******************Render Admin Page *******************************//
exports.index = function(req, res, next) {
    console.log("Fetching Index html cont" +  __dirname+'./../public');
    res.sendFile('index.html', {root: __dirname+'./../public'});
};

//****************************Save BconId ******************************//
exports.createBconId = function(req, res){
    var bcon = req.body.bconId;
    console.log("bcon is::", bcon)
    var createJson = {
        "bcon_id" : bcon,
        "bcon_count": 0
      }
      adminModel.saveBconId(createJson, function(err, data) {
        if(!err) {
          //console.log("allocate connection to clients:::", data);
          console.log('Bcon id created and save successfully');
          res.send(bcon);
          
        }
      })
}



//****************Fetch all admin data ********************//
exports.loadAdminData = function(req, res) {
  console.log('inside doc');
  commonModel.findAllClientsData(function(err, results) {
    if(!err) {
      res.json({"result":results});
      console.log("success to")
    }
    else {
      console.log('else part')
      res.json({ massege: 'error to fetch data', status: 500 });
    }
  })
}


//************************* Load On emit data ***************************//

exports.loadDataOnRefresh = function(condition, callback) {
  commonModel.findClientsData(condition, function(err, data) {
      if(!err) {
        console.log("dat is::", data);
        callback(null, data);
      }
      else {
        console.log("errro", err);
        callback(err);
      }
    })
}