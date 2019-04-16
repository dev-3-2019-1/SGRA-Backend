var express = require('express');
var router = express.Router();

/* GET Requirement list page. */
router.get('/', function(req, res) {
  var db = req.db;
  var collection = db.get('requirementcollection');
  collection.find({},{},function(e,docs){
      res.render('requirementlist', {
          "requirementlist" : docs
      });
  });
});

/* GET New Requirement page. */
router.get('/new', function(req, res) {
  res.render('newrequirement', 
    { 
      title: 'Add New Requirement', 
      action: "/requirements/add" ,
      requirement: {
      }
    });
});

/* GET Edit Requirement page. */
router.get('/:requirementId/edit', async function(req, res) {
  const db = req.db;
  const collection = db.get('requirementcollection');
  const requirement = await collection.findOne({
    _id: req.params.requirementId
  });
  res.render("newrequirement", { title: 'Maintain Requirement', action: "/requirements/update", requirement});
});

/* GET Delete Requirement page. */
router.get('/:requirementId/delete', function(req, res) {
  var db = req.db;
  var collection = db.get('requirementcollection');
  collection.findOneAndDelete({_id: req.params.requirementId}, function(e, docs) {
    console.log(e);
    console.log(docs);
    res.redirect("/requirements");
  });
});

/* POST to Add Requirement Service */
router.post('/add', function(req, res) {

  const db = req.db;
  const requirement = req.body;
  delete requirement._id;
  const collection = db.get('requirementcollection');
  collection.insert(requirement, function (err) {
      if (err) {
        res.send("There was a problem adding the information to the database.");
      }
      else {
        res.redirect("/requirements");
      }
  });
});

/* POST to Update Requirement Service */
router.post('/update', function(req, res) {
  const db = req.db;
  const requirement = req.body;
  const collection = db.get('requirementcollection');
  collection.findOneAndUpdate({ _id: requirement._id}, requirement, function(err) {
    if (err) {
      res.send("There was a problem adding the information to the database.");
    }
    else {
      res.redirect("/requirements");
    }
  });
});




module.exports = router;
