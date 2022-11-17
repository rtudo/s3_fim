'use strict'

const { compareS3 } = require('./compareS3')
const { notifySNS } = require('./notifySNS')

const AWS = require('aws-sdk')
AWS.config.region = process.env.AWS_REGION
const s3 = new AWS.S3()

const processS3 = async (record) => {
  try {
    // Decode URL-encoded key
    const Key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "))

    // Get the list of object versions
    const data = await s3.listObjectVersions({
      Bucket: record.s3.bucket.name,
      Prefix: Key
    }).promise()

    console.log(JSON.stringify(data, null, 2))

    const versions = data.Versions

    // If there was an old version
    if (versions.length > 1) {

      // Sort versions by date (ascending by LastModified)
      const sortedVersions = versions.sort((a, b) => new Date(a.LastModified) - new Date(b.LastModified))

      // Add version number
      for (let i = 0; i < sortedVersions.length; i++) {
        sortedVersions[i].VersionNumber = i + 1
        sortedVersions[i].BucketName = record.s3.bucket.name
      }

      console.log(sortedVersions)

      // Get diff of last two versions
      const diffResult = await compareS3(sortedVersions[sortedVersions.length - 2], sortedVersions[sortedVersions.length - 1])
      console.log('Diff: ', diffResult)

      var fileChanged = false

      //File is changed if any element of diffResult contains either a added or removed key
      for (let i = 0; i < diffResult.length; i++) {
        if ("added" in diffResult[i] || "removed" in diffResult[i]) {
          console.log("Changed")
          fileChanged = true
          break;
        }
      }

      //Notify SNS on file change
      if (fileChanged) {
        await notifySNS(record.s3.bucket.name, Key, diffResult)
      }
      else {
        console.log("No Difference with previous version. Sleep Tight")
      }
    }


    //If there was no version before
    else {
      console.log("No Old Version Found. So Far So Good")
    }

    //You are compliant
  } catch (err) {
    console.error(err)
  }
}

module.exports = { processS3 }

