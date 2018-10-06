'use strict';

// setup
const botname = 'JabberBot';
const config = {
    client: {
        jid: 'undefined',
    },
    debug: false,
};

// add fakes/mocks

// Run core tests
require('./core.js')(botname, config);
