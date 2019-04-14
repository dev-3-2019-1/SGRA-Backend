var express = require('express');
var router = express.Router();

/* GET Home page */
router.get('/', function(req, res) {
    res.render('index', { title: 'SGRA Backend' });
});

module.exports = router;
