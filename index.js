'use strict';

const express = require('express');
const app = express();

var readCount = 0;
var port = process.env.PORT || 8080;
var checkForPresenceInterval = 1000;
var toggleStateTimeout;
var Gpio = require('onoff').Gpio;
var led = new Gpio(4, 'out');
var pir = new Gpio(17, 'in');
var heartbeat;

var state = 0;
function getState() {
    return state;
}

require('./lib/route')(app, getState);

heartbeat = setInterval(function () {
    toggleState(pir.readSync() ^ 0); // 1 = on 0 = off
    console.log(readCount + ': curr state:' + state);
    readCount++;
}, checkForPresenceInterval);

function exit() {
    clearInterval(heartbeat);
    led.unexport();
    pir.unexport();
    process.exit();
};

function toggleState(newState) {
    if (newState !== 1) return;

    turnLedOn();

    if (toggleStateTimeout) {
        console.log('clearing previous toggleStateTimeout.');
        clearTimeout(toggleStateTimeout);
    }

    toggleStateTimeout = setTimeout(turnLedOff, 60000);
}

function turnLedOff() {
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
console.log(`Magic happens on port ${port}`);
