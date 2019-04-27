var express = require('express');
var router = express.Router();

/* GET Materials list page. */
router.get('/', function(req, res) {
  var db = req.db;
  var collection = db.get('materialcollection');
  collection.find({},{},function(e,docs){
      res.render('materiallist', {
          "materiallist" : docs
      });
  });
});

/* GET New Materials page. */
router.get('/new', async function(req, res) {
  const db = req.db;
  const userCollection = db.get('usercollection');
  const projectCollection = db.get('projectcollection');
  const userlist = await userCollection.find({});
  const projectlist = projectCollection.find({},{},function(e,docs){
    res.render('newmaterial', {
      title: 'Add New Materials', 
      action: "/materials/add" ,
      projectlist: projectlist,
      userlist: userlist,
      assign: {},
      material: {
      }
    });
  });
});

/* GET Edit Materials page. */
router.get('/:materialId/edit', async function(req, res) {
  const db = req.db;
  const collection = db.get('materialcollection');
  const material = await collection.findOne({
    _id: req.params.materialId
  });
  const assignCollection = db.get('materialprojectcollection');
  console.log(material);
  const assign = await assignCollection.find({
    'material': material._id
  });
  console.log(assign);
  const projectCollection = db.get('projectcollection');
  const userCollection = db.get('usercollection');
  const projectlist = await projectCollection.find({});
  const userlist = await userCollection.find({});
  res.render("newmaterial", {
    title: 'Maintain Materials',
    action: "/materials/update",
    projectlist: projectlist,
    userlist: userlist,
    assign: assign,
    material
  });
});

/* GET Assign Materials to Projects page. */
router.get('/assignProject', async function(req, res) {
  const db = req.db;
  const materialCollection = db.get('materialcollection');
  const projectCollection = db.get('projectcollection');
  const materiallist = await materialCollection.find({});
  const projectlist = await projectCollection.find({});
  res.render('materialProject', {
    title: 'Assign Project to Material', 
    action: "/materials/relateProject" ,
    projectlist: projectlist,
    materiallist: materiallist,
    assign: {
    }
  });
});

/* POST to relate Materials and Projects Service */
router.post('/relateProject', function(req, res) {
  const db = req.db;
  const assign = req.body;
  delete assign._id;
  const collection = db.get('materialprojectcollection');
  collection.insert(assign, function (err) {
      if (err) {
        res.send("There was a problem adding the information to the database.");
      }
      else {
        res.redirect("/materials");
      }
  });
});

/* GET Delete Materials page. */
router.get('/:materialId/delete', function(req, res) {
  var db = req.db;
  var collection = db.get('materialcollection');
  collection.findOneAndDelete({_id: req.params.materialId}, function(e, docs) {
    console.log(e);
    console.log(docs);
    res.redirect("/materials");
  });
});

/* POST to Add Materials Service */
router.post('/add', function(req, res) {

  const db = req.db;
  const material = req.body;
  delete material._id;
  const collection = db.get('materialcollection');
  collection.insert(material, function (err) {
      if (err) {
        res.send("There was a problem adding the information to the database.");
      }
      else {
        res.redirect("/materials");
      }
  });
});

/* POST to Update Materials Service */
router.post('/update', function(req, res) {
  const db = req.db;
  const material = req.body;
  const collection = db.get('materialcollection');
  collection.findOneAndUpdate({ _id: material._id}, material, function(err) {
    if (err) {
      res.send("There was a problem adding the information to the database.");
    }
    else {
      res.redirect("/materials");
    }
  });
});

module.exports = router;
