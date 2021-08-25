// Dependencies
const { Router } = require('express');
const bodyParser = require('body-parser');

const router = Router();



// Ping route
router.get('/ping', (req, res) => {
  //console.log(`Received API request for /api/ping`);
  res.status(200).send({success: true});
})



// Export Router
module.exports = router;