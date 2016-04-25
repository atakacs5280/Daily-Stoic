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

    return {
        loadGame: function(session, callback) {

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
                    callback(currentQuote);
                } else if (data === undefined) {
                    console.log('else if (data === undefined) {' + data);
                    callback(currentQuote);
                } else {
                    console.log('get quote from dynamodb=' + data.Item.Quote.S);

                    session.attributes.currentQuote = data.Item.Quote.S;
                    currentQuote = session.attributes.currentQuote;
                    callback(currentQuote);
                }
            });
        }

    };
})();
module.exports = storage;
