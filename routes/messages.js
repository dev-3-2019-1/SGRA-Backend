var express = require('express');
var router = express.Router();

/* GET Message list page. */
router.get('/', function(req, res) {
  var db = req.db;
  var collection = db.get('messagecollection');
  collection.find({},{},function(e,docs){
      res.render('messagelist', {
          "messagelist" : docs
      });
  });
});

/* GET New Message page. */
router.get('/new', async function(req, res) {
  const db = req.db;
  const userCollection = db.get('usercollection');
  const projectCollection = db.get('projectcollection');
  const userlist = await userCollection.find({});
  const projectlist = projectCollection.find({},{},function(e,docs){
    res.render('newmessage', {
      title: 'Add New Message', 
      action: "/messages/add" ,
      projectlist: docs,
      userlist: userlist,
      message: {
      }
    });
  });
});

/* GET Edit Message page. */
router.get('/:messageId/edit', async function(req, res) {
  const db = req.db;
  const collection = db.get('messagecollection');
  const message = await collection.findOne({
    _id: req.params.messageId
  });
  const projectCollection = db.get('projectcollection');
  const userCollection = db.get('usercollection');
  const projectlist = await projectCollection.find({});
  const userlist = await userCollection.find({});
  res.render("newmessage", {
    title: 'Maintain Message',
    action: "/messages/update",
    projectlist: projectlist,
    userlist: userlist,
    message
  });
});

/* GET Delete Message page. */
router.get('/:messageId/delete', function(req, res) {
  var db = req.db;
  var collection = db.get('messagecollection');
  collection.findOneAndDelete({_id: req.params.messageId}, function(e, docs) {
    console.log(e);
    console.log(docs);
    res.redirect("/messages");
  });
});

/* POST to Add Message Service */
router.post('/add', function(req, res) {

  const db = req.db;
  const message = req.body;
  delete message._id;
  const collection = db.get('messagecollection');
  collection.insert(message, function (err) {
      if (err) {
        res.send("There was a problem adding the information to the database.");
      }
      else {
        res.redirect("/messages");
      }
  });
});

/* POST to Update Message Service */
router.post('/update', function(req, res) {
  const db = req.db;
  const message = req.body;
  const collection = db.get('messagecollection');
  collection.findOneAndUpdate({ _id: message._id}, message, function(err) {
    if (err) {
      res.send("There was a problem adding the information to the database.");
    }
    else {
      res.redirect("/messages");
    }
  });
});

module.exports = router;
