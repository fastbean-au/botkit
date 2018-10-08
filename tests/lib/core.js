'use strict';

const clone = require('clone');

function CoreTests(botname, originalConfig) {

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
        const config = clone(originalConfig);
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

        const config2 = clone(originalConfig);
        controller.spawn(config2, (bot) => {

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
            const config = clone(originalConfig);
            const controller = require(`../../lib/${botname}`)(config);

            describe('spawn', () => {
                // NB: spawning creates an object that may hold resources and prevents the script from ending
                test('Executes callback', (done) => {
                    const config3 = clone(originalConfig);
                    let spawnCallback = false;
                    controller.spawn(config3, (bot) => {
                        spawnCallback = true;
                    });

                    expect(spawnCallback).toBe(true);
                    done();
                });
            });

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

    });

};

module.exports = CoreTests;
