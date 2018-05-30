Connected Car Demo 

Monthly Oil Level & Tire Pressure SMS Reminder Alert 

![demo screenshot](https://raw.githubusercontent.com/stpangia/connected-car-demo2/master/public/images/project-graphic.png)

Send an SMS reminder alert monthly when user pulls into a gas station.

Integrates with Twilio and Foursquare


### Requirements

- Node.js ([https://nodejs.org/](https://nodejs.org/)) 
	
	This app was built and tested against Node.js v6.2.2

- Dash API Key ([https://dash.by/developers.html/](https://dash.by/developers.html/))

- Foursquare API Key ([https://developer.foursquare.com/](https://developer.foursquare.com/))

- Twilio API Key ([https://www.twilio.com/](https://www.twilio.com/))

### Installation 

- Clone Git repo

- Run (from command line, in root of locally cloned repo)

    `cp .env.example .env`

- Edit .env file
    - In a text editor, modify the .env file created above to suit your environment, API credentials, etc

- Run (from command line, in root of locally cloned repo)

    `npm install`

### Launching the Application 

- Run (from command line, in root of locally cloned repo)

    `npm start`

### Troubleshooting

##### Error: Port in use
Open up .env file in a text editor and change PORT=3000 to PORT=3001 (or 3002, etc)

##### Error: Some other issue
Open an issue in Github


