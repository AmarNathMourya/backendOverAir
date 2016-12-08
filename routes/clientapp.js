var clientCtrl = require('./../controllers/clientapp');



module.exports = function(app, io){
  app.post('/assignconnection', clientCtrl.assignconnection(io));
  app.post('/updateclicks', clientCtrl.updateclicks(io));
};
