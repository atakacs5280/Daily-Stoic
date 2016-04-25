/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Space Geek for a space fact"
 *  Alexa: "Here's your space fact: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID = 'arn:aws:lambda:us-east-1:865113720107:function:dailyStoic'; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var storage = require('./storage');

/**
 * SpaceGeek is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
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
    "GetNewFactIntent": function (intent, session, response) {
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

      response.tellWithCard(speechOutput, "Daily Stoic", speechOutput);
    });
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the DailyStoic skill.
    var dailyStoic = new DailyStoic();
    dailyStoic.execute(event, context);
};
