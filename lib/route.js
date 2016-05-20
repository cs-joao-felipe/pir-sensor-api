'use strict';

const express = require( 'express' );
const router = express.Router();
let getPirState;

router
    .route( '/pir/status' )
    .get( ( req, res ) => {
        res.json( { occupied: getPirState() === 1 } );
    } );

module.exports = ( app, getState ) => {
    getPirState = getState;
    app.use( '/api', router );
};
