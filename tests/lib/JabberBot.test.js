'use strict';

// setup
const botname = 'JabberBot';
const config = {
    client: {
        jid: 'undefined@localhost',
        password: 'undefined',
        host: 'localhost',
        port: 5222
    },
    debug: false,
};

// add fakes/mocks

// Run core tests
require('./core.js')(botname, config);
