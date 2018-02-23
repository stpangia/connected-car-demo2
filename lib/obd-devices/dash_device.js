var base_device = require('./base_device'),
		util = require('util')
		request = require('request-promise');

function dash_device() {
	dash_device.super_.apply(this, arguments);

	this.name = 'dash';

	this.client_id = process.env.DASH_CLIENT_ID;
	this.client_secret = process.env.DASH_CLIENT_SECRET;

	this.endpoints = {
		oath: 'https://dash.by/api/auth/token',
		trips: 'https://dash.by/api/chassis/v1/trips',
		trip: '',
		user: 'https://dash.by/api/chassis/v1/user',
		vehicles: '',
	};
}

util.inherits(dash_device, base_device);

dash_device.prototype.getTrips = function (accessToken) { 
	return request({
		method: 'GET',
	    uri: this.endpoints.trips,
	    headers: { Authorization: `Bearer ${accessToken}` },
	    json: true
	});
};	

dash_device.prototype.getUser = function (accessToken) { 
	return request({
		method: 'GET',
	    uri: this.endpoints.user,
	    headers: { Authorization: `Bearer ${accessToken}` },
	    json: true
	});
};	


module.exports = dash_device;