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

                // Continue if last alert > 1 month AND user is opted in
                if (result.opt_in && (!result.alerted_at || moment().subtract(4, 'w').isAfter(moment(result.alerted_at))) ) {
                  
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
                      console.log('got Foursquare result');
                      console.log(body);
                      if (body.response.venues.length && body.response.venues[0].location.distance <= 50) {
                        
                        // If gas station, send alert
                        console.log('sending alert');
                        var client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
                        client.api.messages.create({
                          body: 'While you\'re stopped at ' + body.response.venues[0].name + ' remember to check your oil and tire pressure.',
                          to: result.mobile,
                          from: process.env.TWILIO_NUMBER,
                        })
                          .then(function(data) {
                            console.log('Alert sent');

                            // And then update alerted_at
                            var dbPromise = Promise.resolve()
                              .then(() => sqlite.open('./database.sqlite', { Promise }))
                              .then(function(db){
                                db.run('UPDATE users SET alerted_at = ? WHERE device_user_id = ?', [moment().utc().format(), result.device_user_id])
                                .then(function () {
                                  console.log('Updated alerted_at');
                                })
                              });                               
                          })
                          .catch(function(err) {
                            console.log('error: ' + err )
                          });
                      }
                    })
                    .catch(function (err) {
                      console.log('error: ' + err )
                    });
                } else {
                  console.log('Supressing alert');
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

