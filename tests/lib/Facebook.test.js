'use strict';

const nock = require('nock');

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

beforeEach(function() {
    nock(`https://${config.api_host}`)
        .get(`/v2.11/me?access_token=${config.access_token}`)
        .reply(200, {
            name: 'undefined',
            id: 'undefined'
        });
});

// Run core tests
require('./core.js')(botname, config);
