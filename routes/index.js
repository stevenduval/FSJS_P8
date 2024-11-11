var express = require('express');
var router = express.Router();

/* GET redirect / to /books */
router.get('/', function(req, res) {
  res.redirect('/books');
});

module.exports = router;