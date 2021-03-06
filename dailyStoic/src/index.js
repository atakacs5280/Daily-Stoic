/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var APP_ID = 'amzn1.echo-sdk-ams.app.a1ff6b81-b0f4-42f7-adef-c98ed78a141a'; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var storage = require('./storage');



var DailyStoic = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
DailyStoic.prototype = Object.create(AlexaSkill.prototype);
DailyStoic.prototype.constructor = DailyStoic;

DailyStoic.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("DailyStoic onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

DailyStoic.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("DailyStoic onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewFactRequest(session, response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
DailyStoic.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("DailyStoic onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

DailyStoic.prototype.intentHandlers = {
    "GetNewQuoteIntent": function (intent, session, response) {
        handleNewFactRequest(session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask Daily Stoic to tell me a quote from stoic philosophy, or, you can say exit... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Gets a random new fact from the list and returns to the user.
 */
function handleNewFactRequest(session, response) {
    storage.loadGame(session, function (currentQuote) {
      // Create speech output
      var speechOutput = "Here's your Daily Stoic quote: " + currentQuote;

      response.tell(speechOutput);
    });
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the DailyStoic skill.
    var dailyStoic = new DailyStoic();
    dailyStoic.execute(event, context);
};
