var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var today = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  var response = [];
  for (let i = 0 ; i < 5; i++) {
    const dayNumber = today.getTime() + oneDay * i;
    for (let j = 14; j < 20; j++) {
      response.push({
        startHour: new Date(dayNumber).setHours(j, 0, 0, 0),
        endHour: new Date(dayNumber).setHours(j + 1, 0, 0, 0)
      });
    }

  }

  res.json(response);

});

module.exports = router;
