'use strict';


var mongoose     =       require('mongoose');

module.exports.collectionName = 'ClickDev';
var clicksSchema = new mongoose.Schema({
    "click_cnt" : Number,
    "cookie_val": String,
    "bcon_id"   : String

  })
 
exports.baseModel = mongoose.model(module.exports.collectionName, clicksSchema);

/**
 * Function to cretae connected client detail into database
 * @param jsonData {JSON_obj} the json object to be added
 * @param: callback {String} the callback function
 */
module.exports.saveClientData = function(jsonData, callback) {
    exports.baseModel.create(jsonData, function(error, savedData){
        callback(error, savedData);
    });
};

/**
 * Function to update click data, connected user count in database
 * @param bconId {String} the device/bcon unique id
 * @param obj {JSON_obj} the json object to be updated
 * @param: callback {String} the callback function
 */
module.exports.updateClickCnt = function(bconId, obj, option, callback) {
    exports.baseModel.update(bconId, obj, option, function(err,updatedbcon){
        callback(err, updatedbcon);
    });

};


/**
 * Function to fetch all clients's details 
 */
module.exports.findAllClientsData = function(callback){    
    exports.baseModel.find(function(error, Data){
        callback(error, Data);
    })
}


/**
 * Function to fetch specific clients's details 
 */
module.exports.findClientsData = function(cookie, callback){    
    exports.baseModel.find(cookie, function(error, Data){
        callback(error, Data);
    })
}