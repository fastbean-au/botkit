'use strict';

// setup
const botname = 'Teams';

let config = {
    clientId: 'client',
    clientSecret: 'secret',
    debug: false
};

const coreConfig = {
    clientId: 'undefined',
    clientSecret: 'undefined',
    serviceUrl: 'undefined',
    debug: 'undefined'
};

// add fakes/mocks

let teamsApi;

{
    jest.doMock('../../lib/TeamsAPI', () => {
        return jest.fn((configuration) => {
            return {
                getToken: jest.fn((cb) => {
                    configuration.token =  'token';
                    configuration.token_expires_in = '3600';
                    cb(null);
                })
            };
        });
    });

    jest.useFakeTimers();
    teamsApi = require('../../lib/TeamsAPI');
 
    // Run core tests

    require('./core.js')(botname, config);

    // reset the fakes/mocks
    jest.resetModules();
    jest.clearAllTimers();
    teamsApi = null;
}

describe('authentication', () => {
    beforeEach(() => {
        jest.doMock('../../lib/TeamsAPI', () => {
            return jest.fn((configuration) => {
                return {
                    getToken: jest.fn((cb) => {
                        configuration.token =  'token';
                        configuration.token_expires_in = '3600';
                        cb(null);
                    })
                };
            });
        });

        jest.useFakeTimers();
        teamsApi = require('../../lib/TeamsAPI');
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllTimers();
    });

    test('get token', () => {
        let bot = require('../../lib/Teams')(config);
        expect(bot.api.getToken).toHaveBeenCalledTimes(1);
    });

    test('refresh token before expiry', () => {
        let bot = require('../../lib/Teams')(config);
        expect(bot.api.getToken).toHaveBeenCalledTimes(1);
        jest.runOnlyPendingTimers();
        expect(bot.api.getToken).toHaveBeenCalledTimes(2);
    });

    test('token valid for 20 mins should refresh after 10 mins', () => {
        teamsApi.mockImplementation(jest.fn((configuration) => {
            return {
                getToken: jest.fn((cb) => {
                    configuration.token =  'token';
                    configuration.token_expires_in = '1200';
                    cb(null);
                })
            };
        }));
        let bot = require('../../lib/Teams')(config);
        expect(bot.config.token_expires_in).toBe('1200');
        expect(bot.api.getToken).toHaveBeenCalledTimes(1);
        jest.runTimersToTime(1000 * 60 * 9);
        expect(bot.api.getToken).toHaveBeenCalledTimes(1);
        jest.runTimersToTime(1000 * 60 * 1.1);
        expect(bot.api.getToken).toHaveBeenCalledTimes(2);
    });
});
