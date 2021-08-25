// Pull in express app
const app = require('./index')


// Start up
app.listen(4444, () => {
  console.log(`App listening on port 4444!`)
});