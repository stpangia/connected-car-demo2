var request = require('request-promise');

function base_device() {

}

base_device.prototype.getAccessToken = function (code) { 
	return request({
		method: 'POST',
	    uri: this.endpoints.oath,
	    body: {
	      client_id: this.client_id,
	      client_secret: this.client_secret,
	      code: code,
	      grant_type: 'authorization_code',
	    },
	    json: true
	});
};	

base_device.prototype.createWebhookObject = function (type, device_user_id, device_vehicle_id, latitude, longitude, timestamp) {
	return {};
};

base_device.prototype.getNormalizedWebhookObject = function (type, device_user_id, device_vehicle_id, latitude, longitude, timestamp) {
	return {};
};

base_device.prototype.getSignatureHeader = function (obj) {
	return {};
};


module.exports = base_device;