var express = require('express');
var router = express.Router();

/* GET Audit list page. */
router.get('/', function(req, res) {
  var db = req.db;
  var collection = db.get('auditcollection');
  collection.find({},{},function(e,docs){
      res.render('auditlist', {
          "auditlist" : docs
      });
  });
});

/* GET New Audit page. */
router.get('/new', async function(req, res) {
  const db = req.db;
  const requirementcollection = db.get('requirementcollection');
  const projectCollection = db.get('projectcollection');
  const requirementlist = await requirementcollection.find({});
  const projectlist = projectCollection.find({},{},function(e,docs){
    res.render('newaudit', {
      title: 'Add New Audit', 
      action: "/audits/add" ,
      projectlist: docs,
      requirementlist: requirementlist,
      audit: {
      }
    });
  });
});

/* GET Edit Audit page. */
router.get('/:auditId/edit', async function(req, res) {
  const db = req.db;
  const collection = db.get('auditcollection');
  const audit = await collection.findOne({
    _id: req.params.auditId
  });
  const projectCollection = db.get('projectcollection');
  const requirementcollection = db.get('requirementcollection');
  const projectlist = await projectCollection.find({});
  const requirementlist = await requirementcollection.find({});
  res.render("newaudit", {
    title: 'Maintain Audit',
    action: "/audits/update",
    projectlist: projectlist,
    requirementlist: requirementlist,
    audit
  });
});

/* GET Delete Audit page. */
router.get('/:auditId/delete', function(req, res) {
  var db = req.db;
  var collection = db.get('auditcollection');
  collection.findOneAndDelete({_id: req.params.auditId}, function(e, docs) {
    console.log(e);
    console.log(docs);
    res.redirect("/audits");
  });
});

/* POST to Add Audit Service */
router.post('/add', function(req, res) {

  const db = req.db;
  const audit = req.body;
  delete audit._id;
  const collection = db.get('auditcollection');
  collection.insert(audit, function (err) {
      if (err) {
        res.send("There was a problem adding the information to the database.");
      }
      else {
        res.redirect("/audits");
      }
  });
});

/* POST to Update Audit Service */
router.post('/update', function(req, res) {
  const db = req.db;
  const audit = req.body;
  const collection = db.get('auditcollection');
  collection.findOneAndUpdate({ _id: audit._id}, audit, function(err) {
    if (err) {
      res.send("There was a problem adding the information to the database.");
    }
    else {
      res.redirect("/audits");
    }
  });
});

module.exports = router;
