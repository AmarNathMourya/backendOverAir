
'use strict';


var commonModel    =     require('../models/commonmodel');
var adminModel    = require('../models/adminmodel');
var guid           =     require('guid');
var async          =     require('async');
var url            =     require('url');




//***********************Save Profile Data*************************//

exports.assignconnection = function(socket) {


  return function(req, res) {
    console.log("req obj is::", req.body)
    var clientCookie = req.body.customCookie;
    var getCookie = req.headers.cookies;
    var bcon = req.headers.bconcookies;
    console.log("save profile data is::", clientCookie, req.headers.cookies, req.headers.bconcookies);
    
    if (getCookie === undefined && bcon === undefined)
    {
        async.waterfall([
          function(callback) {
            adminModel.findBconData({"bcon_count": {$lt:4}}, function(err, data) {
              if(!err) {
                if(data.length !== 0) {
                  var bconId = data[0].bcon_id;

                  var bconCount = data[0].bcon_count + 1;
                  var createJson = {
                    "click_cnt" : 0,
                    "cookie_val": clientCookie,
                    "bcon_id" : bconId
                  }
                  var BconIdObj = {
                    "bcon_id" : bconId
                  }

                  adminModel.updateBconCnt(BconIdObj, {$set: {"bcon_count": bconCount}}, function(err, data) {
                    if(!err) {
                      console.log("Bcon count updated successfully", data, BconIdObj,bconCount);
                    }
                    else {
                      console.log("Error in update bcon count", err);
                    }
                  })

                  commonModel.saveClientData(createJson, function(err, data) {
                    if(!err) {
                      //console.log("allocate connection to clients:::", data);
                      console.log('cookie created successfully');
                      var noAvailable = false;
                      callback(null, noAvailable, bconId);                 
                    }
                    else {
                      console.log("error to create new client", err);
                      callback(err);
                    }
                  })
                }

                else {
                  console.log("No device id available for current user");
                  var noAvailable = true;
                  var availableFlg = false;
                  callback(null, noAvailable, availableFlg);

                }
                
              }
              else {
                callback(err);
              }
            })
        },

        function(availableFlg, bconId, callback) {
          if(availableFlg === false) {
            var BconIdObj = {
              "bcon_id" : bconId
            }
            commonModel.findClientsData(BconIdObj, function(err, data) {
              if(!err) {
                data.push(BconIdObj);
                console.log("assing connection data", data)
                socket.emit('connectedUserData', data);
                callback(null, BconIdObj);
              }
              else {
                callback(err);
              }
            })
          }
          else {
            callback(null, availableFlg);
          }
        }

        ],

        function (err, results) {
          console.log("check in final callback");
                if(err){
                    res.status(400).json({apiStatus: "Failure", msg: "Error while to assign Device ID"});
                }
                else if(results === true) {
                  res.json({ messege: 'Group is full with existing deviceID' });
                }
                else{
                    res.json({message: 'success', result: results});
                }

            }
        )
      
    } 
    else
    {
      console.log('getCookie exists', getCookie);
      res.json({message: 'connection_assigned'});
    } 
  }
}

//****************** Update Click Counter************************//
exports.updateclicks = function(socket) {
  return function(req, res) {
    console.log("cookie param is::", req.body.updtCookie, req.body.updtBcon)
    var cookieVal = req.body.updtCookie;
    var bconVal = req.body.updtBcon;
    async.waterfall([
        function(callback) {
          console.log("hello")
          var selectionCrita = {
            $and:[{"cookie_val": cookieVal},{"bcon_id": bconVal}]
          }
          commonModel.findClientsData(selectionCrita, function(err, data) {
            if(!err) {
              console.log("data is -----", data)
              callback(null, data);
            }
            else {
              callback(err);
            }
            
          })
        },

        function(data, callback) {
          var updtCritria = {
            $and:[{"cookie_val": cookieVal},{"bcon_id": bconVal}]
          }
          if(data[0].click_cnt === 0) {
            var updtObj = {
              $set: {"click_cnt": 1}
            }
          }
          else {
            var newClck = data[0].click_cnt + 1;
            var updtObj = {
              $set: {"click_cnt": newClck}
            }
          }
          
          commonModel.updateClickCnt(updtCritria, updtObj, function(err, data) {
            if(!err) {
              console.log("update click is::", data);
              callback(null, data)
            }
            else {
              console.log("error to update clicks")
              callback(err);
            }
          })
        },

        function(getData, callback) {
          var conditionBcn = {"bcon_id": bconVal}
          commonModel.findClientsData(conditionBcn, function(err, data) {
            if(!err) {
              console.log("good got it", data)
              socket.emit('connectedUserData', data);
              callback(null);
            }
            else {
              callback(err);
            }
          })
        }
      ],

      function (err, results) {
          if(err){
              res.status(400).json({apiStatus: "Failure", msg: "Error to update click"});
          }
          else{
              res.json({message: 'success'});
          }
      }
    );
  }
}




