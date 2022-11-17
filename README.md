# Amazon S3 FIM

Serves Compliances requirement like that of PCI DSS

This repository contains src code required for AWS Lambda function. The Lambda function is invoked when new objects are put into the bucket. If there is any difference detected between the uploaded version of the object and the previous version, a notification is pushed to a SNS Topic. 

- Amazon S3 bucket with versioning enabled is required
- Permission for s3 to invoke the lambda function
- Amazon SNS topic with permission for lambda to publish

### Structure
```bash
.
├── README.MD                   <-- This instructions file
├── src                         <-- Source code for a lambda function
│   └── app.js                  <-- Main Lambda handler
│   └── processS3.js            <-- Processes each S3 object
│   └── notify.js               <-- Notify the difference to a SNS Topic
│   └── compareS3.js            <-- Compares most recent two versions
```

### Permissions Required

1. lambda:InvokeFunction on lambda for s3 principal
2. sns:publish on sns topic Access Policy for lambda principal
3. sns:publish for iam role for lambda's iam role

### Testing

- Update bucket name, region and sns topic arn
- Upload test.txt twice to your s3 root
- Install Dependencies 
- run `node test.js`

### Note : 
Project is cloned from https://github.com/aws-samples/s3-to-lambda-diff-checker which compares and also deletes the old version as per the threshold. But make sure that this pull request is merged https://github.com/aws-samples/s3-to-lambda-diff-checker/pull/1 before using it as it fixes the critical bug 
