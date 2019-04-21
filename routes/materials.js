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
      projectlist: docs,
      userlist: userlist,
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
  const projectCollection = db.get('projectcollection');
  const userCollection = db.get('usercollection');
  const projectlist = await projectCollection.find({});
  const userlist = await userCollection.find({});
  res.render("newmaterial", {
    title: 'Maintain Materials',
    action: "/materials/update",
    projectlist: projectlist,
    userlist: userlist,
    material
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
