var base_device = require('./base_device'),
		util = require('util')
		request = require('request-promise');

function automatic_device() {
	automatic_device.super_.apply(this, arguments);

	this.name = 'automatic';

	this.client_id = process.env.AUTOMATIC_CLIENT_ID;
	this.client_secret = process.env.AUTOMATIC_CLIENT_SECRET;

	this.endpoints = {
		oath: '',
		trips: '',
		trip: '',
		user: '',
		vehicles: '',
	};
}

util.inherits(automatic_device, base_device);

automatic_device.prototype.getTrips = function (accessToken) { 
	return request({
		method: 'GET',
	    uri: this.endpoints.trips,
	    headers: { Authorization: `Bearer ${accessToken}` },
	    json: true
	});
};	


automatic_device.prototype.createWebhookObject = function (type, device_user_id, device_vehicle_id, latitude, longitude, timestamp) {
	/*{
				payload: { 
					vehicleId: req.body.vehicleId,
					latitude: req.body.lat,
					longitude: req.body.lon,
					date: '2014-08-22T14:48:35+00:00'
				},
				eventType: 'ignition_off',
				userId: req.body.userId
	};*/
			
	return {biz:'baz'};
};




module.exports = automatic_device;