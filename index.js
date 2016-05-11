var express    = require('express');
var app        = express();
var port = process.env.PORT || 8080; 

var Gpio = require('onoff').Gpio,
  buzzer = new Gpio(4, 'out'),
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
  // buzzer.writeSync(state);
  console.log("curr state:" + state);
}, 2000);

function exit() {
  buzzer.unexport();
  pir.unexport();
  process.exit();
};

process.on('SIGINT', exit);
