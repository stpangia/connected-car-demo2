var deviceAdapter = require('../lib/deviceAdapter');
var Promise = require('bluebird');
var sqlite = require('sqlite');

exports.device_callback = function(req, res) {
	// Initialize user's device via adapter
  var device = deviceAdapter.getDevice(req.params.device);

  var result = null;

  if (req.params.simulated && req.params.simulated == 'simulated') {
  	res.render('user', { user: result, flash: {status:'success', message:'Simulated webhook sent'} }); 
  } else {
	  // Awknowledge POST
		res.status(204).send();	
  }
	

};

