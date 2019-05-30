var express = require('express');
var router = express.Router();

/* GET Inbox list page. */
router.get('/', async function(req, res) {
  var db = req.db;
  
  var loggedUserCollection = db.get('loggedusercollection');
  var loggedUser = await loggedUserCollection.findOne({});
  var userCollection = db.get('usercollection');
  loggedUser = await userCollection.findOne({
    useremail: loggedUser.useremail
  });
  var messageCollection = db.get('messagecollection');

  messageCollection.find({
    receivers: loggedUser._id.toString()
  },{},function(e,docs){
      res.render('inbox', {
          messagelist : docs
      });
  });
});

module.exports = router;
