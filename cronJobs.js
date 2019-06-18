var CronJob = require('cron').CronJob;
var moment = require('moment');

module.exports = async function (db) {
  new CronJob('0 9 * * *', async function () { // replace with * * * * * to run every minute for testing
    const now = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(now.getDate() + 7);
    const requirementsAboutToExpire = await db.get('projectRequirementsCollection').find({
      $and: [
        {
          solvedate: {
            $gt: now,
            $lt: weekFromNow
          }
        },
        {
          $or: [
            {
              status: {
                $eq: "OPEN"
              }
            },
            {
              status: {
                $eq: "PENDING"
              }
            }
          ]
        }
      ]
    });

    if (requirementsAboutToExpire && requirementsAboutToExpire.length) {
      const messages = formatRequirementsAsMessages(requirementsAboutToExpire);
      db.get("messagecollection").insert(messages, (err) => {
        if (err) {
          console.log("Something went wrong while running requirements CRON job:");
          console.log(err);
        }
      });
    }
  }, null, true);
};

function formatRequirementsAsMessages(requirementsAboutToExpire) {
  return requirementsAboutToExpire.map((a) => {
    return {
      messagetext: `Requirement ${a.requirementName} of project ${a.projectName} is in status ${a.status} and will expire in ${moment.utc(a.solvedate).format("DD-MM-YYYY")}. Please expedite.`,
      sender: "SYSTEM",
      receivers: a.responsibleUser,
      project: a.proj,
    };
  });
}

