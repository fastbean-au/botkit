'use strict';

// setup
const botname = 'TwilioSMSBot';
const config = {
    account_sid: 'undefined',
    auth_token: 'undefined',
    twilio_number: 'undefined',
    debug: false,
};

// add fakes/mocks

// Run core tests
require('./core.js')(botname, config);
