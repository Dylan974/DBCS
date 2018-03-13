import * as functions from 'firebase-functions';

import * as  admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);


import * as twilio from 'twilio';
const accountSid = functions.config().twilio.sid
const authToken  = functions.config().twilio.token

const client = new twilio(accountSid, authToken);

const twilioNumber = '+14245238950' // your twilio phone number

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/// start cloud function

// exports.textStatus = functions.database
// .ref('/orders/{orderKey}/status')
// .onUpdate(event => {

//     const orderKey = event.params.orderKey

//     return admin.database()
//         .ref(`/orders/${orderKey}`)
//         .once('value')
//         .then(snapshot => snapshot.val())
//         .then(order => {
//             const status      = order.status
//             const phoneNumber = order.phoneNumber

//             if ( !validE164(phoneNumber) ) {
//                 throw new Error('number must be E164 format!')
//             }

//             const textMessage = {
//                 body: `Current order status: ${status}`,
//                 to: phoneNumber,  // Text to this number
//                 from: twilioNumber // From a valid Twilio number
//             }

//             return client.messages.create(textMessage)
//         })
//         .then(message => console.log(message.sid, 'success'))
//         .catch(err => console.log(err))
// });


// /// Validate E164 format
// function validE164(num) {
//     return /^\+?[1-9]\d{1,14}$/.test(num)
// }