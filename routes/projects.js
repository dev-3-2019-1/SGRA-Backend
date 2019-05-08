var express = require('express');
var router = express.Router();

/* GET Project list page. */
router.get('/', function(req, res) {
  var db = req.db;
  var collection = db.get('projectcollection');
  collection.find({},{},function(e,docs){
      res.render('projectlist', {
          "projectlist" : docs
      });
  });
});

/* GET New Project page. */
router.get('/new', function(req, res) {
  const db = req.db;
  const userCollection = db.get('usercollection');
  userCollection.find({},{},function(e,docs){
    res.render('newproject', {
      title: 'Add New Project', 
      action: "/projects/add" ,
      userlist: docs,
      relatedMaterialsList: {},
      relatedRequirementsList: {},
      project: {}
    });
  });
});

/* GET Edit Project page. */
router.get('/:projectId/edit', async function(req, res) {
  const db = req.db;
  const collection = db.get('projectcollection');
  const userCollection = db.get('usercollection');

  const project = await collection.findOne({
    _id: req.params.projectId
  });
  const projectMaterialsCollection = db.get('projectMaterialsCollection');
  const relatedMaterialsList = await projectMaterialsCollection.find({
    proj: req.params.projectId
  });
  const projectRequirementsCollection = db.get('projectRequirementsCollection');
  const relatedRequirementsList = await projectRequirementsCollection.find({
    proj: req.params.projectId
  });
  userCollection.find({},{},function(e,docs){
    res.render("newproject", { 
      title: 'Maintain Project', 
      action: "/projects/update", 
      relatedMaterialsList: relatedMaterialsList,
      relatedRequirementsList: relatedRequirementsList,
      userlist: docs,
      project
    });
  });
});

/* GET Delete Project page. */
router.get('/:projectId/delete', function(req, res) {
  var db = req.db;
  var collection = db.get('projectcollection');
  collection.findOneAndDelete({_id: req.params.projectId}, function(e, docs) {
    console.log(e);
    console.log(docs);
    res.redirect("/projects");
  });
});

/* POST to Add Project Service */
router.post('/add', function(req, res) {

  const db = req.db;
  const project = req.body;
  delete project._id;
  const collection = db.get('projectcollection');
  collection.insert(project, function (err) {
      if (err) {
        res.send("There was a problem adding the information to the database.");
      }
      else {
        res.redirect("/projects");
      }
  });
});

/* POST to Update Project Service */
router.post('/update', function(req, res) {
  const db = req.db;
  const project = req.body;
  const collection = db.get('projectcollection');
  collection.findOneAndUpdate({ _id: project._id}, project, function(err) {
    if (err) {
      res.send("There was a problem adding the information to the database.");
    }
    else {
      res.redirect("/projects");
    }
  });
});

module.exports = router;
