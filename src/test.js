// Mock event
const event = require('./testEvent.json')

// Mock environment variables
process.env.AWS_REGION = 'ap-south-1'
process.env.SNS_TOPIC = '<SNS TOPIC ARN>'
process.env.localTest = true
process.env.KEEP_VERSIONS = 3

// Lambda handler
const { handler } = require('./app')

const main = async () => {
  console.time('localTest')
  console.dir(await handler(event))
  console.timeEnd('localTest')
}

main().catch(error => console.error(error))