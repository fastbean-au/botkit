'use strict';

// setup
const botname = 'CiscoSparkbot';
const config = {
    ciscospark_access_token: 'undefined',
    debug: false,
    log: false,
    public_address: 'http://www.testurl.com',
    secret: 'undefined',
    studio_token: 'undefined',
    webhook_name: 'undefined',
};

// add fakes/mocks

// Run core tests
require('./core.js')(botname, config);
