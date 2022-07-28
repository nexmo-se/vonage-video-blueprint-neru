const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

const config = JSON.parse(process.env['NERU_CONFIGURATIONS']);

const port = process.env.NERU_APP_PORT;

const vonageApp = require('./vonage-server-app.js')

// Constants
const appURI = config.appURI;

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// set the view engine to ejs
app.set('view engine', 'ejs');

console.log(__dirname);
app.use(express.static(__dirname + '/public')); 

app.get('/_/health', async (req, res) => {
    res.sendStatus(200);
});

app.get('/up', async (req, res) => {
    res.json({ up: "vonage-video-blueprint-neru" });
});

app.get('/', async (req, res) => {
    let emailQueueID = config.genesysCloud.emailQueueID
    let implicitGrantID = config.genesysCloud.implicitGrantID

    if (!appURI || !implicitGrantID){
        console.error('Some configuration items empty.')
        res.status(500).end();
    } else {
        res.render('index.ejs', {
            appURI: appURI,
            emailQueueID: emailQueueID,
            implicitGrantID: implicitGrantID
        });
    }
});

// Create a session if not yet created
app.get('/room/agent/:conversation_id', async (req, res) => {
    let conversation_id = req.params.conversation_id;
    let userName = req.query.username || 'N/A';

    vonageApp.createRoom(conversation_id, userName)
    .then((vonageData) => {
        res.render('agent-room.ejs', {
            vonageData: vonageData,
            appURI: appURI
        });
    })
    .catch((e) => {
        console.error(e);
        res.render('error.ejs', {});
    })
});

// Create room for customer participant
app.get('/room/customer/:conversation_id', async (req, res) => {
    let conversation_id = req.params.conversation_id;
    let userName = req.query.username || 'N/A';

    vonageApp.createRoom(conversation_id, userName)
    .then((vonageData) => {
        res.render('customer-room.ejs', {
            vonageData: vonageData,
            appURI: appURI
        });
    })
    .catch((e) => {
        res.render('error.ejs', {});
    })
});

app.get('/error', (req, res) => {
    res.render('error.ejs', {});
});

// API for sending Vonage Video link via SMS
app.post('/sendlinktosms', async (req, res) => {
    vonageApp.sendSMS(req.body)
    .then(() => {
        res.status(200).send({success: true});
    })
    .catch((err) => {
        console.log(err);
        res.status(400);
    })
})    


// Run Node server
app.listen(port, () => {
    console.log(`Example app listening at ${appURI} port ${port}`);
    console.log(`Test Mode: ${config.testMode ? 'ON' : 'OFF'}`);
});

