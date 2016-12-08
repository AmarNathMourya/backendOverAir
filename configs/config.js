/**
 * File to set environment variables that can be used to switch between different environments, e.g. dev/staging/prod
 */

// Set the ENVIRONMENT variable to point to the right environment
exports.ENV = 'development';
//exports.ENV = 'staging';
//exports.ENV = 'production';

//switch the connection handles depending on the environment
switch(exports.ENV){
	case 'development':
		module.exports.MONGO_HOST= 'localhost';
		module.exports.MONGO_PORT = 27017;
		module.exports.MONGO_DBNAME = 'devOverAir';
		module.exports.MONGO_USERNAME = '';
		module.exports.MONGO_PASSWORD = '';
		module.exports.APP_PORT = 5000;
		module.exports.APP_HOST='http://localhost';

	break;

}



