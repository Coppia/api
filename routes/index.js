var express = require('express');
var jwt    = require('jsonwebtoken'); 

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Coppia.co' });
});

module.exports = router;
