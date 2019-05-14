var express = require('express');
var router = express.Router();

/* GET Project Materials list page. */
router.get('/', function(req, res) {
  var db = req.db;
  var collection = db.get('projectMaterialsCollection');
  collection.find({},{},function(e,docs){
    res.render('projectMaterialList', {
      projectMaterialList: docs
    });
  });
});

/* GET New Project Materials page. */
router.get('/new', async function(req, res) {
  const db = req.db;
  const materiallist = await getListFromCollection(db,"materialcollection")
  const projectlist = await getListFromCollection(db,"projectcollection")
  const userlist = await getListFromCollection(db,"usercollection")
  res.render('newProjectMaterial', {
    title: 'Assign Project to Material', 
    action: "/projectMaterials/add" ,
    projectlist: projectlist,
    materiallist: materiallist,
    userlist: userlist,
    projectMaterial: {}
  });
});

/* POST to Add Project Materials Service */
router.post('/add', async function(req, res) {
  const db = req.db;
  const projectMaterial = req.body;
  delete projectMaterial._id;
  const materialName = await getOneEntryFromCollection(db, "materialcollection", {_id: projectMaterial.mat});
  const projectName = await getOneEntryFromCollection(db, "projectcollection", {_id: projectMaterial.proj});
  const userName = await getOneEntryFromCollection(db, "usercollection", {_id: projectMaterial.responsibleUser});
  projectMaterial.materialName = materialName.materialname;
  projectMaterial.projectName = projectName.projectname;
  projectMaterial.userName = userName.username;
  const collection = db.get('projectMaterialsCollection');
  collection.insert(projectMaterial, function (err) {
    if (err) {
      res.send("There was a problem adding the information to the database.");
    }
    else {
      res.redirect("/projectMaterials");
    }
  });
});

/* GET Edit Project Materials page. */
router.get('/:projectMaterialId/edit', async function(req, res) {
  const db = req.db;
  const projectMaterial = await getOneEntryFromCollection(db, "projectMaterialsCollection", {_id: req.params.projectMaterialId});
  const materiallist = await getListFromCollection(db, 'materialcollection');
  const projectlist = await getListFromCollection(db, 'projectcollection');
  const userlist = await getListFromCollection(db, 'usercollection');
  res.render("newProjectMaterial", {
    title: 'Maintain Assignment',
    action: "/projectMaterials/update",
    materiallist: materiallist,
    projectlist: projectlist,
    userlist: userlist,
    projectMaterial
  });
});

/* POST to Update Project Materials Service */
router.post('/update', async function(req, res) {
  const db = req.db;
  const projectMaterial = req.body;
  const collection = db.get('projectMaterialsCollection');
  const materialName = await getOneEntryFromCollection(db, "materialcollection", {_id: projectMaterial.mat});
  const projectName = await getOneEntryFromCollection(db, "projectcollection", {_id: projectMaterial.proj});
  const userName = await getOneEntryFromCollection(db, "usercollection", {_id: projectMaterial.responsibleUser});
  projectMaterial.materialName = materialName.materialname;
  projectMaterial.projectName = projectName.projectname;
  projectMaterial.userName = userName.username;
  collection.findOneAndUpdate({ _id: projectMaterial._id}, projectMaterial, function(err) {
    if (err) {
      res.send("There was a problem adding the information to the database.");
    }
    else {
      res.redirect("/projectMaterials");
    }
  });
});

/* GET Delete Project Materials page. */
router.get('/:projectMaterialId/delete', function(req, res) {
  var db = req.db;
  var collection = db.get('projectMaterialsCollection');
  collection.findOneAndDelete({_id: req.params.projectMaterialId}, function(e, docs) {
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
