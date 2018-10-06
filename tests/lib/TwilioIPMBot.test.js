'use strict';

// setup
const botname = 'TwilioIPMBot';
const config = {
    TWILIO_ACCOUNT_SID: 'undefined',
    TWILIO_AUTH_TOKEN: 'undefined',
    TWILIO_IPM_SERVICE_SID: 'undefined',
    TWILIO_API_KEY: 'undefined',
    TWILIO_API_SECRET: 'undefined',
    debug: false,
};

// add fakes/mocks

// Run core tests
require('./core.js')(botname, config);
