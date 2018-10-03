'use strict';

function CoreTests(botname, config) {

    // list of methods comes from https://botkit.ai/docs/core.html

    const controllerMethods = [
        'changeEars',
        'defineBot',
        'excludeFromConversations',
        'hears',
        'on',
        'setTickDelay',
        'setupWebserver',
        'shutdown',
        'spawn',
        'startTicking',
        'trigger',
        'userAgent',
        'version',
    ];

    // note: startPrivateConversation and createPrivateConversation are not implemented on all platforms.
    const botMethods = [
        'createConversation',
        //'createPrivateConversation',
        'reply',
        'say',
        'startConversation',
        //'startPrivateConversation',
    ];

    const conversationMethods = [
        'activate',
        'addMessage',
        'addQuestion',
        'say',
        'ask',
        'gotoThread',
        'transitionTo',
        'beforeThread',
        'setVar',
        'onTimeout',
        'extractResponses',
        'extractResponse',
        'sayFirst',
        'stop',
        'repeat',
        'silentRepeat',
        'next',
        'setTimeout',
        'hasThread',
        'successful',
    ];

    describe(`Core tests (methods) - ${botname}`, () => {
        const controller = require(`../../lib/${botname}`)(config);

        test('Controller object created', (done) => {
            expect(controller).toBeDefined();
            expect(typeof controller).toBe('object');
            done();
        });

        controllerMethods.forEach((property) => {
            test(`Controller object has method ${property}`, (done) => {
                expect(controller).toHaveProperty(property);
                expect(typeof controller[property]).toBe('function');
                done();
            });
        });

        // NB: spawning creates an object that may hold resources and prevents the script from ending
        controller.spawn(config, (bot) => {
            test('Bot object created', (done) => {
                expect(bot).toBeDefined();
                expect(typeof bot).toBe('object');
                done();
            });

            botMethods.forEach((property) => {
                test(`Bot object has method ${property}`, (done) => {
                    expect(bot).toHaveProperty(property);
                    expect(typeof bot[property]).toBe('function');
                    done();
                });
            });

            // setup the controller to hear messages
            controller.hears(['test #1'], 'message_received', (bot, message) => {
                // conversation tests
                bot.startConversation(message, (err, convo) => {
                    test('Conversation object created', (done) => {
                        expect(convo).toBeDefined();
                        expect(typeof convo).toBe('object');
                        done();
                    });

                    conversationMethods.forEach((property) => {
                        test(`Conversation object has method ${property}`, (done) => {
                            expect(convo).toHaveProperty(property);
                            expect(typeof convo[property]).toBe('function');
                            done();
                        });
                    });

                });
            });

            // execute the test
            controller.ingest(bot, {
                text: 'test #1',
                user: 'user',
                channel: 'channel',
                timestamp: Date.now(),
            }, null);

        });

        test('Controller shutdown', (done) => {
            controller.shutdown();

            done();
        });
    });

    describe(`Core tests (functional) - ${botname}`, () => {

        describe('Controller methods', () => {
            const controller = require(`../../lib/${botname}`)(config);

            describe('userAgent', () => {
                test('Returns a string', (done) => {
                    expect(typeof controller.userAgent()).toBe('string');
                    done();
                });

                test('Is immutable', (done) => {
                    const original = controller.userAgent();
                    controller.userAgent('test string');
                    expect(controller.userAgent()).toEqual(original);
                    done();
                });
            });

            describe('Version', () => {
                test('Returns a version string', (done) => {
                    expect(controller.version()).toMatch(/\d+[.]\d+[.]\d+/);
                    done();
                });

                test('Is immutable', (done) => {
                    const original = controller.version();
                    controller.version('0.0.0');
                    expect(controller.version()).toEqual(original);
                    done();
                });
            });

            controller.shutdown();
        });

        describe('Bot methods', () => {
            const controller = require(`../../lib/${botname}`)(config);

            // NB: spawning creates an object that may hold resources and prevents the script from ending
            controller.spawn(config, (bot) => {

                bot.say({text: 'bot say message', channel: 'channel'}, (err, response) => {
                    test('Say', (done) => {
                        expect(err).toBeUndefined();
                        expect(response).toBeUndefined(); // But we really don't expect this to be undefined, do we? The doc says "response", but response from what?
                        done();
                    });
                });

                controller.hears(['test #2'], 'message_received', (bot, message) => {
                    bot.reply(message, 'test 2 response', (err, response) => {
                        test('reply', (done) => {
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

};

module.exports = CoreTests;
