var adminCtrl = require('./../controllers/adminapp');
var url = require('url');



module.exports = function(app, io){
  app.get('/usersData', adminCtrl.loadAdminData);
  app.post('/bconId', adminCtrl.createBconId);
  app.get('/', adminCtrl.index);
};

