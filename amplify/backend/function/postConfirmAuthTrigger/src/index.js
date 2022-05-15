var aws = require("aws-sdk");

var ses = new aws.SES();

exports.handler = (event, context, callback) => {
  console.log(event);
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;

  var to = event.request.userAttributes.email;
  var subject = "Your Sign-up on nPOD is confirmed!";
  var body =
    "Congratulations, " +
    event.userName +
    "! Your sign-up has been confirmed. " +
    "\r\n" +
    "Now you can login and start using the account now." +
    "\r\n" +
    "Log in here: https://portal.jdrfnpod.org/signin";
  var body2 = "\r\n" + "Sent at " + dateTime + " UTC";
  if (event.request.userAttributes.email) {
    sendEmail(to, subject, body + " " + body2, function (status) {
      // Return to Amazon Cognito
      callback(null, event);
    });
  } else {
    // Nothing to do, the user's email ID is unknown
    callback(null, event);
  }
};

function sendEmail(to, subject, body, completedCallback) {
  var eParams = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      },
    },

    // Replace source_email with your SES validated email address
    Source: "service@jdrfnpod.org",
  };

  var email = ses.sendEmail(eParams, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("===EMAIL SENT===");
    }
    completedCallback("Email sent");
  });
  console.log("EMAIL CODE END");
}
