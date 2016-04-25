/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';
var AWS = require("aws-sdk");
var moment = require('moment');

var storage = (function () {
    var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    var todayIS = moment().subtract(5, 'hours').format('l');
    console.log(todayIS);
//     /*
//      * The Game class stores all game states for the user
//      */
//     function Game(session, data) {
//         if (data) {
//             this.data = data;
//         } else {
//             this.data = {
//                 players: [],
//                 scores: {}
//             };
//         }
//         this._session = session;
//     }
//
    // Game.prototype = {
//         isEmptyScore: function () {
//             //check if any one had non-zero score,
//             //it can be used as an indication of whether the game has just started
//             var allEmpty = true;
//             var gameData = this.data;
//             gameData.players.forEach(function (player) {
//                 if (gameData.scores[player] !== 0) {
//                     allEmpty = false;
//                 }
//             });
//             return allEmpty;
//         },
//         save: function (callback) {
//             //save the game states in the session,
//             //so next time we can save a read from dynamoDB
//             this._session.attributes.currentGame = this.data;
//             dynamodb.putItem({
//                 TableName: 'ScoreKeeperUserData',
//                 Item: {
//                     CustomerId: {
//                         S: this._session.user.userId
//                     },
//                     Data: {
//                         S: JSON.stringify(this.data)
//                     }
//                 }
//             }, function (err, data) {
//                 if (err) {
//                     console.log(err, err.stack);
//                 }
//                 if (callback) {
//                     callback();
//                 }
//             });
//         }
    // };
//
    return {
        loadGame: function(session, callback) {
            // if (session.attributes.currentGame) {
            //     console.log('get game from session=' + session.attributes.currentGame);
            //     callback(new Game(session, session.attributes.currentGame));
            //     return;
            // }
            console.log(todayIS);
            dynamodb.getItem({
                TableName: 'StoicQuotes',
                Key: {
                    "TodayIs": {
                      "S": todayIS
                    }
                }
            },

                function (err, data) {
                console.log(data);
                var currentQuote = '' ;
                if (err) {
                    console.log(err, err.stack);
                    // currentQuote = new Game(session);
                    // session.attributes.currentQuote = currentQuote.data;
                    callback(currentQuote);
                } else if (data === undefined) {
                    console.log('else if (data === undefined) {' + data);
                    // currentQuote = new Game(session);
                    // session.attributes.currentQuote = currentQuote.data;
                    callback(currentQuote);
                } else {
                    console.log('get quote from dynamodb=' + data.Item.Quote.S);
                    //currentQuote = JSON.parse(data.Item.Quote.S);
                    session.attributes.currentQuote = data.Item.Quote.S;
                    currentQuote = session.attributes.currentQuote;
                    callback(currentQuote);
                }
            });
        }
//         newGame: function (session) {
//             return new Game(session);
//         }
    };
})();
module.exports = storage;
