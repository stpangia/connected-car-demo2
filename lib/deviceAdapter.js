let device = null;

exports.getDevice = function(name) {
	if (!device) {
		device_class = require('./obd-devices/' + name + '_device');
		device = new device_class;
	}
	return device;
};