var express = require('express');
var router = express.Router();

/* GET Inbox list page. */
router.get('/', function(req, res) {
  var db = req.db;
  var collection = db.get('messagecollection');
  collection.find({
    receivers: "5ca7f1ae16204230d4920566"
  },{},function(e,docs){
      res.render('inbox', {
          messagelist : docs
      });
  });
});

module.exports = router;
