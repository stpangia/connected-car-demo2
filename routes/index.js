var express = require('express');
var router = express.Router();

// Require controller modules.
var user_controller = require('../controllers/userController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET OAuth handshake. */
router.get('/oauth-redirect/:device', user_controller.oauth_handshake);

/* GET User. */
router.get('/user', user_controller.user);

/* POST User save/update. */
router.post('/user', user_controller.update);

/* GET Logout and forget token (Should be POST but this is just a demo project). */
router.get('/logout', user_controller.logout);

module.exports = router;
