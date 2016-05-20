var readCount= 0;
var express    = require('express');
var app        = express();
var port = process.env.PORT || 8080; 
var delay = 1000;
var timeout;
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
  toggleState(pir.readSync() ^ 0); // 1 = on 0 = off
  console.log(readCount +": curr state:" + state);
  readCount++;
}, delay);

function exit() {
  led.unexport();
  pir.unexport();
  process.exit();
};

function toggleState(newState) {
 if(newState === 1) {
   led.writeSync(1);
   if(timeout) {
     console.log("clearing previous timeout.");
     clearTimeout(timeout);
   }
   state = 1;
   timeout = setTimeout(offLed,60000);
 }
};

function offLed(){
 led.writeSync(0);
 state = 0;
};

process.on('SIGINT', exit);
