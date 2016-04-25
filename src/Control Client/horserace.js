/**
 * Copyright (C) 2016 Push Technology Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
 
var diffusion = require('diffusion');
var fs = require('fs');

var horseJSON = {};
var horseData = [];
var diffusionHost     = "localhost";
var diffusionPort     = 8080;
var diffusionUser     = "admin"
var diffusionPassword = "password";
var diffusionTopic    = "horsedata";
var dataFileName      = "./data.json";
var fileRowNum        = 0;
var delay             = 15; // Delay between sending out each row of data in ms

// Connect to Diffusion
function connectToDiffusion() {
	console.log("Connecting to Diffusion...");
    diffusion.connect({
        principal : diffusionUser,
        credentials : diffusionPassword,
        host : diffusionHost,
        port : diffusionPort,
        secure : false, 
    }).then(onConnectSuccess, onConnectError);

    function onConnectSuccess(session) {
        console.log('Connected!');

        // Attach state listeners
        session.on({
            disconnect : function() {
               console.log('Disconnected!');
            },
            reconnect : function() {
               console.log('Reconnected!');
            },
            error : function(error) {
               console.log('Session error', error);
            },
            close : function(reason) {
               console.log('Session closed', reason);
            }
        });

		// Create the JSON topic
		session.topics.add(diffusionTopic, diffusion.topics.TopicType.JSON).then(
            function(result) {
                console.log('JSON Topic Added : ' + result.topic);
			  
                // Start the updates to the topic
                updateTopic(session);
            },
            function(error) {
                console.log('JSON Topic Add Failed : ' + error);
            });
    }


    function onConnectError(error) {
        console.log('Failed to connect!!!');
    }
} 

function updateTopic(session) {
    // Create content from the JSON data
    var json = JSON.parse(horseData[fileRowNum]);
    var content = diffusion.datatypes.json().from(json);

    // Update the topic with the content
    session.topics.update(diffusionTopic, content).then(onComplete, onError);
    fileRowNum = fileRowNum + 1;
    if (fileRowNum == horseData.length-1)
        fileRowNum = 0;

    // Delay until the next record is published
    setTimeout(function(){updateTopic(session)}, delay);

    function onComplete(status) {
    }

    function onError(error) {
        console.log("onError!" + error);
    }
}

function importHorseDataAndPublish() {
    fs.readFile(dataFileName, function (err, data) {
        if (err) {
            console.log("Failed to open file: " + err);
        }
	 
        horseData = data.toString().split('\r\n');
        connectToDiffusion();
    });
}

importHorseDataAndPublish();
