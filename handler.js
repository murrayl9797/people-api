const awsServerlessExpress = require('aws-serverless-express');
const app = require('./server/index');

const server = awsServerlessExpress.createServer(app);

module.exports.handler = (event, context, callback) => {

  /** Immediate response for WarmUP plugin **/
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return callback(null, 'Lambda is warm!');
  }

  // Else, use server
  return awsServerlessExpress.proxy(server, event, context);
}