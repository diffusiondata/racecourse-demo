# racecourse-demo

The Racecourse Demo displays a sample set of data provided by Total Performance Data. The data represents
the real-time tracks of 8 race horses during an actual race at Lingfield race course in the UK. The data
file itself is not included with this source, in order to get a copy of the file, please contact Total Performance
Data at http://totalperformancedata.com/ and copy the provided data file intop the Control Client directory
renamed to data.json

The demo comprises a Javascript Control Client that reads the data from a file and publishes it in near 
real-time, record by record, over Diffusion or Reappt using the new JSON topics released with Diffusion 
5.7. A Javascript client subscribes to the data and displays it on to Google Maps as it is received.
 
Instructions
------------

1. Install and start Diffusion or start a Reappt instance:
	- download.pushtechnology.com
	- https://reappt.io

2. Edit src/Client/racecourseclient.html
	- Replace the Google Maps key in line 24 by your own, keys are free and can be obtained from https://developers.google.com/maps/documentation/javascript/get-api-key#get-an-api-key
	- Change the server URL and port on lines 57 and 58 to point to your Diffusion or Reappt instance if necessary.
	- Save the file.

3. Open the client, src/Client/racecourseclient.html in a browser

4. Install the Diffusion JS client via npm, in a command prompt or shell:
	- cd src/Control Client
	- npm install diffusion

5. Start the Control Client
	- node horserace.js
	
