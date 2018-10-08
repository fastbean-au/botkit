'use strict';

// setup
const botname = 'ConsoleBot';
const config = {
    debug: false,
};

// add fakes/mocks

// Run core tests
require('./core.js')(botname, config);

describe(`Functional Tests - ${botname}`, () => {

    describe('Bot methods', () => {
        const controller = require(`../../lib/${botname}`)(config);

        // NB: spawning creates an object that may hold resources and prevents the script from ending
        controller.spawn(config, (bot) => {

            bot.say({text: 'bot say message', channel: 'channel'}, (err, response) => {
                test('Say', (done) => {
                    expect(err).toBeUndefined();
                    expect(response).toBeUndefined(); // the doc says "response", but does not indicate what the response is.
                    done();
                });
            });

            controller.hears(['test #2'], 'message_received', (bot, message) => {
                bot.reply(message, 'test 2 response', (err, response) => {
                    test('Reply', (done) => {
                        expect(err).toBeUndefined();
                        expect(response).toBeUndefined();
                        done();
                    });
                });
            });

            // execute the test
            controller.ingest(bot, {
                text: 'test #2',
                user: 'user',
                channel: 'channel',
                timestamp: Date.now(),
            }, null);

        });

        controller.shutdown();
    });

    describe('Conversation methods', () => {
        const controller = require(`../../lib/${botname}`)(config);

        // NB: spawning creates an object that may hold resources and prevents the script from ending
        controller.spawn(config, (bot) => {

            // setup the controller to hear messages
            controller.hears(['test #3'], 'message_received', (bot, message) => {

                // conversation tests
                bot.startConversation(message, (err, convo) => {
                    test('Conversation started', (done) => {
                        expect(err).toBeNull();
                        expect(convo).toBeDefined;
                        expect(typeof convo).toBe('object');
                        done();
                    });
                });
            });

            // execute the test
            controller.ingest(bot, {
                text: 'test #3',
                user: 'user',
                channel: 'channel',
                timestamp: Date.now(),
            }, null);

        });

        controller.shutdown();
    });

});
