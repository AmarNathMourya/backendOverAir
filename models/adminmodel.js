'use strict'

var mongoose     =       require('mongoose');

module.exports.collectionName = 'bconData';
var bconSchema = new mongoose.Schema({
    "bcon_id"   : String,
    "bcon_count": Number

  })
 
exports.baseModel = mongoose.model(module.exports.collectionName, bconSchema);


/**
 * Function to bconID save to database
 * @param bconJson {JSON_obj} the json object to be added
 * @param: callback {String} the callback function
 */
module.exports.saveBconId = function(bconJson, callback) {
    exports.baseModel.create(bconJson, function(error, savedData){
        callback(error, savedData);
    });
};


/**
 * Function to fetch bconId details less than 4
 */
module.exports.findBconData = function(criteria, callback){    
    exports.baseModel.find(criteria, function(error, Data){
        callback(error, Data);
    })
}

/**
 * Function to update bcon Count in database
 */
module.exports.updateBconCnt = function(criteria, obj, callback) {
    exports.baseModel.update(criteria, obj, function(err,updatedbcon){
        callback(err, updatedbcon);
    });

};