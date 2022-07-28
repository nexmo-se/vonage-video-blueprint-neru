// import express from  'express';
// import bodyParser from 'body-parser';
// import { Messages, Scheduler, Voice, neru } from 'neru-alpha';


// const app = express()
// app.use(bodyParser.json());

// const session = neru.createSession();
// const voice = new Voice(session);

// await voice.onVapiAnswer('onCall').execute();

// app.get('/', async (req, res, next) => {
//     console.log("default route / has reached.")
//     res.send("i'm alive!");
// });


// app.post('/onCall', async (req, res, next) => {
//     try {
//         const session = neru.createSession(); 
//         const voice = new Voice(session); 
//         const messaging = new Messages(session);
//         const state = session.getState();

//         await voice.onVapiEvent({'vapiUUID': req.body.uuid, callback:'/onEvent'}).execute();

//         await messaging.listenMessages(
//             { type: "sms", number: req.body.from }, 
//             { type: "sms", number: req.body.to },
//             'onMessage'
//         ).execute(); 
//         await state.set("calldata", {
//             region_url: req.body.region_url,
//             callUUID: req.body.uuid,
//             flowState: 'parkid'
//         });

//         res.json([
//             {
//                 action: 'talk',
//                 text: 'Welcome to VonagePark, enter the car park ID, followed by a hash to continue',
//                 bargeIn: true
//             },
//             {
//                 action: 'input',
//                 type: ['dtmf'],
//                 dtmf: {
//                     timeOut: '10',
//                     submitOnHash: true
//                 }
//             }
//         ]);
//     } catch (error) {
//         next(error);
//     }
// });

// app.post('/onEvent', async (req, res, next) => {
//     try {
//         if (req.body.dtmf != null) {
//             const session = neru.getSessionFromRequest(req);
//             const state = session.getState();
//             const messaging = new Messages(session);
            
//             const from = req.body.from;
//             const to = { type: "sms", number: from };
//             const vonageNumber = { type: "sms", number: req.body.to }; 

//             const digits = req.body.dtmf.digits;
//             const data = await state.get("calldata");

//             switch (data.flowState) {
//                 case 'parkid':
//                     data.flowState = 'duration';
//                     data.parkingID = digits;
//                     await state.set("calldata", data);

//                     res.json([
//                         {
//                             action: 'talk',
//                             text: `You are parking at ${digits}. Press a digit to choose how many hours you want to pay for.`,
//                             bargeIn: true
//                         },
//                         {
//                             action: 'input',
//                             type: ['dtmf'],
//                             dtmf: {
//                                 timeOut: '10',
//                                 submitOnHash: true
//                             }
//                         }
//                     ]);
//                     break;


//                 case 'duration':
//                     data.flowState = 'reg';
//                     data.duration = digits;
//                     await state.set("calldata", data);
//                     await messaging.sendText(
//                         vonageNumber,
//                         to,
//                         `Please reply with your car's registration number`
//                     ).execute();

//                     res.json([
//                         {
//                             action: 'talk',
//                             text: `You will receive a text from this number, reply with your car's registration number.`
//                         },
//                         {
//                             action: 'stream',
//                             streamUrl: ["https://onhold2go.co.uk/song-demos/free/a-new-life-preview.mp3"], 
//                             loop: "0"
//                         }
//                     ]);
//                     break;

//                 case 'pay':
//                     const scheduler = new Scheduler(session);

//                     await chargeCard();
            
//                     await messaging.sendText(
//                         vonageNumber,
//                         to,
//                         `You are parking at ${data.parkingID} and have paid for ${data.duration} hours.`
//                     ).execute();

//                     res.json([
//                         {
//                             action: 'talk',
//                             text: `Your card has been charged for ${data.duration} hours. You will receive a text confirmation and a reminder when your parking is about to expire`,
//                         }
//                     ]);
//                     break;
//             }

//         } else {
//             console.log(req.body)
//         }
//     } catch (error) {
//         next(error);
//     }
// });

// app.post('/onMessage', async (req, res, next) => {
//     try {
//         const session = neru.getSessionFromRequest(req)
//         const state = session.getState(); 
//         const data = await state.get("calldata");

//         data.flowState = 'pay';
//         data.reg = req.body.message.content.text;
//         await state.set('calldata', data );
//         const voice  = new Voice(session, data.region_url);

//         await voice.uploadNCCO(data.callUUID, 
//             {
//                 "action": "transfer",
//                 "destination": {
//                   "type": "ncco",
//                   "ncco": [
//                     {
//                         action: 'talk',
//                         text: `You've registered the car ${data.reg}. Enter your card number followed by a hash to pay.`,
//                         bargeIn: "true"
//                     },
//                     {
//                         action: 'input',
//                         type: ['dtmf'],
//                         dtmf: {
//                             timeOut: '10',
//                             submitOnHash: "true"
//                         }
//                     }
//                   ]
//                 }
//             }
//         ).execute();

//        res.sendStatus(200);
//     } catch (error) {
//         next(error);
//     }
// });

// app.post('/parkingReminder', async (req, res, next) => {
//     try {
//         const session = neru.getSessionFromRequest(req)
//         const state = session.getState();
//         const messaging = new Messages(session);

//         const from = req.body.from;
//         const data = await state.get("calldata");

//         const to = { type: "sms", number: from };
//         const vonageNumber = { type: "sms", number: req.body.to }; 

//         await messaging.sendText(
//             vonageNumber,
//             to,
//             `Your parking at ${data.parkingID} is about to run out.`
//         ).execute();
 

//        res.sendStatus(200);
//     } catch (error) {
//         next(error);
//     }
// });


// async function chargeCard() {
// 	return new Promise((resolve) => {
//         setTimeout(resolve, 1.5 * 1000);
//       });
// }


// app.get('/_/health', async (req, res, next) => {
//     res.send('OK');
// });


// app.listen(process.env.NERU_APP_PORT, () => {
//     console.log(`Example app listening on port ${process.env.NERU_APP_PORT}`)
// })