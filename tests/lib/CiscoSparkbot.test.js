'use strict';

const sinon = require('sinon');
const ciscospark = require('ciscospark');

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
// NB: nock will not work here as the CiscoSpark libraries have their own http interceptors

// TODO: replace sinon with jest mocks (see Teams for an example)
const fake = sinon.fake.returns({
    people: {
        get: () => {
            return Promise.resolve({
                displayName: 'undefined',
                id: 'undefined',
                orgid: 'undefined',
            });
        }
    }
});
sinon.replace(ciscospark, 'init', fake);

// Run core tests
require('./core.js')(botname, config);
sinon.restore();
