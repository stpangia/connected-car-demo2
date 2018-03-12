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
  var device = deviceAdapter.getDevice(req.session.device.type);

  // Get user
	device.getUser(req.session.device.user_token)
		.then(function(body) {
			// Save Device user ID to session
			req.session.device.device_user_id = body.id;

			// Check if existing user
			var dbPromise = Promise.resolve()
			  .then(() => sqlite.open('./database.sqlite', { Promise }))
			  .then(function(db){
			  	var user;
					db.get('SELECT * FROM users WHERE device_user_id = ?', req.session.device.device_user_id)
						.then(function (result) {
							// Save if new user
							if (!result) {
								db.run('INSERT INTO users (device_user_id) VALUES (?)', req.session.device.device_user_id)
								.then(function (result) {
									res.render('user'); 
								})
							} else {
								res.render('user', { user: result, flash: req.flash() }); 
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
	// sanitize input
	var mobile = req.body.mobile.replace(/[^0-9]/g,'');
	var opt_in = !!req.body.opt_in;
	// validate input 
	if (mobile.length != 10) {
		req.flash('warn', 'Invalid cell number. Enter a 10-digit US phone number.')
		res.redirect('user');
	} else {
		// Save user
		var dbPromise = Promise.resolve()
			.then(() => sqlite.open('./database.sqlite', { Promise }))
			.then(function(db){
				db.run('UPDATE users SET mobile = ?, opt_in = ? WHERE device_user_id = ?', [mobile, opt_in, req.session.device.device_user_id])
				.then(function () {
					db.get('SELECT * FROM users WHERE device_user_id = ?', req.session.device.device_user_id)
						.then(function (result) {
							req.flash('success', 'User profile updated')
							res.redirect('user');
						})
				})
			});			
	}
};	

exports.logout = function(req, res) {
	req.session.destroy(function(err) {
		res.redirect('/');
	})
};

