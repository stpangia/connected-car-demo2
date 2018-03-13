var deviceAdapter = require('../lib/deviceAdapter');
var Promise = require('bluebird');
var sqlite = require('sqlite');
var moment = require('moment');
var request = require('request-promise');

exports.device_callback = function(req, res) {
	// Initialize user's device via adapter
  var device = deviceAdapter.getDevice(req.params.device);

  var result = null;

  if (req.params.simulated && req.params.simulated == 'simulated') {
    // created formatted webhook from input
    var simulatedWebhook = device.createWebhookObject(req.body.event, req.body.deviceUserId, req.body.deviceVehicleId, req.body.latitude, req.body.longitude, req.body.timestamp);

    // get normalized object
    var payload = device.getNormalizedWebhookObject(simulatedWebhook); 
    console.log(payload);

    // Identify user

      var dbPromise = Promise.resolve()
        .then(() => sqlite.open('./database.sqlite', { Promise }))
        .then(function(db){
          var user;
          db.get('SELECT * FROM users WHERE device_user_id = ?', payload.deviceUserId)
            .then(function (result) {
              if (result) {
                // Continue if last alert > 1 month
                if (!result.alerted_at || moment(result.alerted_at).subtract(4, 'w').isBefore(moment(result.alerted_at)) ) {
                  // Lookup location via Foursquare
                  console.log('ok to send alert');
                  request({
                    method: 'GET',
                      uri: 'https://api.foursquare.com/v2/venues/search',
                      qs: {
                        ll: payload.latitude + ',' + payload.longitude,
                        radius: 50,
                        categoryId: '4bf58dd8d48988d113951735',
                        client_id: process.env.FOURSQUARE_CLIENT_ID,
                        client_secret: process.env.FOURSQUARE_CLIENT_SECRET,
                        v: process.env.FOURSQUARE_VERSION_DATE
                      },
                      json: true
                  })
                    .then(function(body) {
                      console.log('got FS result');
                      console.log(body);
                      if (body.response.venues.length && body.response.venues[0].location.distance <= 50) {
                        // If gas station, send alert
                        console.log('sending alert');

                        // And then update alerted_at
                        console.log('updating alerted_at');

                      }
                    })
                    .catch(function (err) {
                      console.log('error: ' + err )
                    });
                }
              } 
            })
        });     
    req.flash('success', 'Simulated webhook sent')
    res.redirect('/user');
  } else {
    /*
      As this is a demo, we're not expecting real webhooks. But you can
      copy and paste the simulation code from above and basically get it
      functional for real webhooks.
    */
	  // Awknowledge POST
		res.status(204).send();	
  }
	

};

