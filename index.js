'use strict';

var readCount = 0;
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var delay = 1000;
var timeout;
var Gpio = require('onoff').Gpio,
  led = new Gpio(4, 'out'),
  pir = new Gpio(17, 'in'),
  iv;

var state = 0;
function getState() {
    return state;
}

require('./lib/route')(app, getState);

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
    if(newState !== 1) return;

    turnLedOn();

    if (timeout) {
        console.log("clearing previous timeout.");
        clearTimeout(timeout);
    }

    timeout = setTimeout(turnLedOff, 60000);
}

function turnLedOff(){
    led.writeSync(0);
    state = 0;

    console.log('Led had just turned off');
}

function turnLedOn() {
    led.writeSync(1);
    state = 1;

    console.log('Led ');
}

process.on('SIGINT', exit);

app.listen(port);
console.log(`Magic happens on port ${ port }`);
