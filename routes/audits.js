var express = require('express');
var router = express.Router();
var request = require('request-promise');
var moment = require('moment');

router.get('/', function(req, res) {
  var db = req.db;
  var collection = db.get('auditcollection');
  collection.find({},{},function(e,docs){
      res.render('auditlist', {
          "auditlist" : docs
      });
  });
});

router.get('/new', async function(req, res) {
  const db = req.db;
  const requirementcollection = db.get('requirementcollection');
  const projectCollection = db.get('projectcollection');
  const requirementlist = await requirementcollection.find({});
  const availableHoursList = await getAvailableHours(req);
  projectCollection.find({},{},function(e,docs){
    res.render('newaudit', {
      title: 'Add New Audit', 
      action: "/audits/add" ,
      projectlist: docs,
      availableHoursList,
      moment,
      requirementlist,
      audit: {
      }
    });
  });
});

router.get('/book', async function(req, res) {
  const db = req.db;
  const requirementcollection = db.get('requirementcollection');
  const projectCollection = db.get('projectcollection');
  const requirementlist = await requirementcollection.find({});
  const availableHoursList = await getAvailableHours(req);
  const docs = await projectCollection.find({});
  res.render('bookAudit', {
    title: 'Agendar Auditoria', 
    action: "/audits/add" ,
    projectlist: docs,
    requirementlist,
    audit: {
    },
    availableHoursList,
    moment
  });
});

router.get('/:auditId/book', async function(req, res) {
  const db = req.db;
  const collection = db.get('auditcollection');
  const audit = await collection.findOne({
    _id: req.params.auditId
  });
  const projectCollection = db.get('projectcollection');
  const requirementcollection = db.get('requirementcollection');
  const projectlist = await projectCollection.find({});
  const requirementlist = await requirementcollection.find({});
  const availableHoursList = await getAvailableHours(req);
  res.render("bookAudit", {
    title: 'Agendar Auditoria', 
      action: "/audits/update" ,
      projectlist,
      requirementlist,
      audit,
      availableHoursList,
      moment
  });
});

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
  const availableHoursList = await getAvailableHours(req);
  res.render("newaudit", {
    title: 'Maintain Audit',
    action: "/audits/update",
    projectlist: projectlist,
    requirementlist,
    audit,
    availableHoursList,
    moment
  });
});

router.get('/:auditId/delete', function(req, res) {
  var db = req.db;
  var collection = db.get('auditcollection');
  collection.findOneAndDelete({_id: req.params.auditId}, function(e, docs) {
    console.log(e);
    console.log(docs);
    res.redirect("/audits");
  });
});

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
async function getAvailableHours(req) {
  return await request(req.protocol + "\:\/\/" + req.get('host') + '/secretariat', {
    json: true
  });
}

