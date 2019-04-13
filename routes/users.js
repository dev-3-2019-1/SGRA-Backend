var express = require('express');
var router = express.Router();

/* GET User list page. */
router.get('/', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{},function(e,docs){
      res.render('userlist', {
          "userlist" : docs
      });
  });
});

/* GET New User page. */
router.get('/new', function(req, res) {
  res.render('newuser', { title: 'Add New User' });
});

/* GET Edit User page. */
router.get('/:userId/edit', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.update({name: req.params.userId}, {$set: {name: "HIIII"}}, function(e, docs) {
    console.log(e);
    console.log(docs);
    res.redirect("/users");
  });
});

/* GET Delete User page. */
router.get('/:userId/delete', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.delete({name: req.params.userId}, function(e, docs) {
    console.log(e);
    console.log(docs);
    res.redirect("/users");
  });
});

/* POST to Add User Service */
router.post('/add', function(req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var userName = req.body.username;
  var userEmail = req.body.useremail;

  // Set our collection
  var collection = db.get('usercollection');

  // Submit to the DB
  collection.insert({
      "username" : userName,
      "email" : userEmail
  }, function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          // And forward to success page
          res.redirect("/users");
      }
  });
});

module.exports = router;
