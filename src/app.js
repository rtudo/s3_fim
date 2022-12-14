'use strict'

const { processS3 } = require('./processS3')

exports.handler = async (event) => {
  console.log (JSON.stringify(event, null, 2))

  await Promise.all(
    event.Records.map(async (record) => {
      try {
        await processS3(record)
      } catch (err) {
        console.error(err)
      }
    })
  )
}
