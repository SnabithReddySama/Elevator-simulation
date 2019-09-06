var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var path = __dirname
  path = path.split('\\')
  path[path.length-1] = 'views'
  path = path.join('\\')
  console.log(path)
  res.sendFile( path+'\\index.html');
});
router.get('/set', function(req, res, next) {
  var path = __dirname
  path = path.split('\\')
  path[path.length-1] = 'views'
  path = path.join('\\')
  console.log(path)
  res.sendFile( path+'\\ElevatorSimulation.html');
});
module.exports = router;
