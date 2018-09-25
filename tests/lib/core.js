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

    describe(`Core tests - ${botname}`, () => {
        const controller = require(`../../lib/${botname}`)(config);

        test('Controller object created', (done) => {
            expect(controller).toBeDefined();
            expect(typeof controller).toBe('object');
            done();
        });

        controllerMethods.forEach((property) => {
            test (`Controller object has method ${property}`, (done) => {
                expect(controller).toHaveProperty(property);
                expect(typeof controller[property]).toBe('function');
                done();
            });
        });

        // NB: spawning creates an object that holds resources and prevents the script from ending
        controller.spawn({}, (bot) => {
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
            controller.hears(['test1'], 'message_received', (bot, message) => {
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
                text: 'test1',
                user: 'user',
                channel: 'channel',
                timestamp: Date.now(),
            }, null);
    
        });

        controller.shutdown();
    });

};

module.exports = CoreTests;
