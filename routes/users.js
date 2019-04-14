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
  res.render('newuser', 
    { 
      title: 'Add New User', 
      action: "/users/add" ,
      user: {
      }
    });
});

/* GET Edit User page. */
router.get('/:userId/edit', async function(req, res) {
  const db = req.db;
  const collection = db.get('usercollection');
  const user = await collection.findOne({
    _id: req.params.userId
  });
  res.render("newuser", { title: 'Maintain User', action: "/users/update", user});
});

/* GET Delete User page. */
router.get('/:userId/delete', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.findOneAndDelete({_id: req.params.userId}, function(e, docs) {
    console.log(e);
    console.log(docs);
    res.redirect("/users");
  });
});

/* POST to Add User Service */
router.post('/add', function(req, res) {

  const db = req.db;
  const user = req.body;
  delete user._id;
  const collection = db.get('usercollection');
  collection.insert(user, function (err) {
      if (err) {
        res.send("There was a problem adding the information to the database.");
      }
      else {
        res.redirect("/users");
      }
  });
});

/* POST to Update User Service */
router.post('/update', function(req, res) {
  const db = req.db;
  const user = req.body;
  const collection = db.get('usercollection');
  collection.findOneAndUpdate({ _id: user._id}, user, function(err) {
    if (err) {
      res.send("There was a problem adding the information to the database.");
    }
    else {
      res.redirect("/users");
    }
  });
});




module.exports = router;
