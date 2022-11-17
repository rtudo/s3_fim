'use strict'

const AWS = require('aws-sdk')
AWS.config.region = process.env.AWS_REGION 
const sns = new AWS.SNS();
const snsTopicARN = process.env.SNS_TOPIC

const notifySNS = async (bucketName, key, diffResult) => {

  var notificationMessage = {
    "bucketName": bucketName,
    "key": key,
    "Diff": diffResult
  }

  var snsParams = {
    Message: JSON.stringify(notificationMessage, null, 2),
    Subject: "S3 FIM Alert",
    TopicArn: snsTopicARN
};
  
  console.log("Notification Message:", notificationMessage)
 
  // Create promise and SNS service object
// var publishTextPromise = sns.publish(snsParams).promise();

// // Handle promise's fulfilled/rejected states
// publishTextPromise.then(
//   function(data) {
//     console.log(`Message ${snsParams.Message} sent to the topic ${snsParams.TopicArn}`);
//     console.log("MessageID is " + data.MessageId);
//   }).catch(
//     function(err) {
//     console.error(err, err.stack);
//   });
  //Push the Message to SNS
    await sns.publish(snsParams, function (err, data) {
      if (err) {
          console.log("SNS Push Failed:");
          console.log(err.stack);
          return;
      }
      console.log('SNS push suceeded: ' + JSON.stringify(data));
      return data;
  });
}

module.exports = { notifySNS }