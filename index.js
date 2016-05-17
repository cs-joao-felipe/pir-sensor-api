var express    = require('express');
var app        = express();
var port = process.env.PORT || 8080; 
var delay = 1000;
var Gpio = require('onoff').Gpio,
  led = new Gpio(4, 'out'),
  pir = new Gpio(17, 'in'),
  iv;

var state = 0;

// routings
var router = express.Router();
router.route('/pir/status')
    .get(function(req, res) {
	res.json({ occupied: state === 1 });
    });

app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);

iv = setInterval(function () {
  state = pir.readSync() ^ 0; // 1 = on 0 = off
  toggleLed(state);
  console.log("curr state:" + state);
}, delay);

function exit() {
  led.unexport();
  pir.unexport();
  process.exit();
};

function toggleLed(state) {
 if(state === 1) {
   led.writeSync(1);
   setTimeout(offLed,60000);
 }
};

function offLed(){
 led.writeSync(0);
};

process.on('SIGINT', exit);
