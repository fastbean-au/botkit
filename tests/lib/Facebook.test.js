'use strict';

// setup
const botname = 'Facebook';
const config = {
    api_host: 'testurl.com',
    access_token: 'undefined',
    verify_token: 'undefined',
    app_secret: 'undefined',
    debug: false,
};

// add fakes/mocks

// Run core tests
require('./core.js')(botname, config);
