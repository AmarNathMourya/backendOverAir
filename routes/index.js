/**
* main file for routing
*/

module.exports = function(app, io, fs) {
	fs.readdirSync(__dirname).forEach(function (file, indexer) {
		if (file.indexOf('.js') < 0 || file == 'index.js') {
			return true;
		}
		else {
			require('./' + file)(app,io);
		}
	})
}
