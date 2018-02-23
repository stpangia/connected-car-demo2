var deviceAdapter = require('../lib/deviceAdapter');
var Promise = require('bluebird');
var sqlite = require('sqlite');

exports.oauth_handshake = function(req, res) {
	// Initialize user's device via adapter
  var device = deviceAdapter.getDevice(req.params.device);

  // Get access token
	device.getAccessToken(req.query.code)
		.then(function(body) {
			// Set session var with device info
			req.session.device = {
				type: device.name,
				user_token: body.access_token
			};
			// Redirect to user add/edit
			res.redirect('/user');
		})
		.catch(function (err) {
			console.log('error: ' + err )
			return next(err);
    });
};

exports.user = function(req, res) {
	// Initialize user's device via adapter
  var device = deviceAdapter.getDevice(req.params.device);

  // Get user
	device.getUser(req.session.device.user_token)
		.then(function(body) {

			// Check if existing user
			var dbPromise = Promise.resolve()
			  .then(() => sqlite.open('./database.sqlite', { Promise }))
			  .then(function(db){
			  	var user;
					db.get('SELECT * FROM users WHERE device_user_id = ?', body.id)
						.then(function (result) {
							// Save if new user
							if (!result) {
								db.run('INSERT INTO users (device_user_id) VALUES (?)', body.id)
								.then(function (result) {
									res.render('user'); 
								})
							} else {
								res.render('user', { user: result }); 
							}
						})
			  });			
			
		})
		.catch(function (err) {
			console.log('error: ' + err )
			return next(err);
    });
};


exports.update = function(req, res) {

};	

exports.logout = function(req, res) {
	req.session.destroy(function(err) {
		res.redirect('/');
	})
};

