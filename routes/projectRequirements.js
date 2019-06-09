var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET Project Requirements list page. */
router.get('/', function(req, res) {
  var db = req.db;
  var collection = db.get('projectRequirementsCollection');
  collection.find({},{},function(e,docs){
    res.render('projectRequirementList', {
      projectRequirementList: docs
    });
  });
});

/* GET New Project Requirements page. */
router.get('/new', async function(req, res) {
  const db = req.db;
  const requirementlist = await getListFromCollection(db,"requirementcollection")
  const projectlist = await getListFromCollection(db,"projectcollection")
  const userlist = await getListFromCollection(db,"usercollection")
  res.render('newProjectRequirement', {
    title: 'Assign Project to Requirement', 
    action: "/projectRequirements/add" ,
    projectlist: projectlist,
    requirementlist: requirementlist,
    userlist: userlist,
    projectRequirement: {},
    moment
  });
});

/* POST to Add Project Requirements Service */
router.post('/add', async function(req, res) {
  const db = req.db;
  const projectRequirement = req.body;
  delete projectRequirement._id;
  const requirementName = await getOneEntryFromCollection(db, "requirementcollection", {_id: projectRequirement.requirement});
  const projectName = await getOneEntryFromCollection(db, "projectcollection", {_id: projectRequirement.proj});
  const userName = await getOneEntryFromCollection(db, "usercollection", {_id: projectRequirement.responsibleUser});
  projectRequirement.requirementName = requirementName.requirementname;
  projectRequirement.projectName = projectName.projectname;
  projectRequirement.userName = userName.username;
  const collection = db.get('projectRequirementsCollection');
  collection.insert(projectRequirement, function (err) {
    if (err) {
      res.send("There was a problem adding the information to the database.");
    }
    else {
      res.redirect("/projectRequirements");
    }
  });
});

/* GET Edit Project Requirements page. */
router.get('/:projectRequirementId/edit', async function(req, res) {
  const db = req.db;
  const projectRequirement = await getOneEntryFromCollection(db, "projectRequirementsCollection", {_id: req.params.projectRequirementId});
  const requirementlist = await getListFromCollection(db, 'requirementcollection');
  const projectlist = await getListFromCollection(db, 'projectcollection');
  const userlist = await getListFromCollection(db, 'usercollection');
  res.render("newProjectRequirement", {
    title: 'Maintain Assignment',
    action: "/projectRequirements/update",
    requirementlist: requirementlist,
    projectlist: projectlist,
    userlist: userlist,
    projectRequirement,
    moment
  });
});

/* POST to Update Project Requirements Service */
router.post('/update', async function(req, res) {
  const db = req.db;
  const projectRequirement = req.body;
  const collection = db.get('projectRequirementsCollection');
  const requirementName = await getOneEntryFromCollection(db, "requirementcollection", {_id: projectRequirement.requirement});
  const projectName = await getOneEntryFromCollection(db, "projectcollection", {_id: projectRequirement.proj});
  const userName = await getOneEntryFromCollection(db, "usercollection", {_id: projectRequirement.responsibleUser});
  projectRequirement.solvedate = new Date(projectRequirement.solvedate);
  projectRequirement.requirementName = requirementName.requirementname;
  projectRequirement.projectName = projectName.projectname;
  projectRequirement.userName = userName.username;
  collection.findOneAndUpdate({ _id: projectRequirement._id}, projectRequirement, function(err) {
    if (err) {
      res.send("There was a problem adding the information to the database.");
    }
    else {
      res.redirect("/projectRequirements");
    }
  });
});

/* GET Delete Project Requirements page. */
router.get('/:projectRequirementId/delete', function(req, res) {
  var db = req.db;
  var collection = db.get('projectRequirementsCollection');
  collection.findOneAndDelete({_id: req.params.projectRequirementId}, function(e, docs) {
    console.log(e);
    console.log(docs);
    res.redirect("back");
  });
});

let getListFromCollection = (db, collectionName) => {
  const collection = db.get(collectionName);
  return collection.find({});
}

let getOneEntryFromCollection = async (db, collectionName, searchObject) => {
  collection = db.get(collectionName);
  return collection.findOne(searchObject);
};

module.exports = router;
