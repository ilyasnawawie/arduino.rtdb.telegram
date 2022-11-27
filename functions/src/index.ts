import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import * as admin from "firebase-admin";

admin.initializeApp();
const bot = express();

bot.use(cors( {origin: true}));

bot.post("/", async function(req, res) {
  const telegramText = req.body;
  req.body.message &&
  req.body.message.chat &&
  req.body.message.chat.id &&
  req.body.message.from &&
  req.body.message.from.first_name;

  if (telegramText) {
    const chat_id = req.body.message.chat.id;
    const first_name = req.body.message.from.first_name;
    const receivedMessage = req.body.message.text;

    //  Define your RTDB Reference
    const rtdbReference = admin.database().ref("Sensor MQ7");
    const snapshot = rtdbReference.child("-NHi5G4wg1m-MrPYvMPQ/MQ7").get();

    //  Fetch the data
    const snap = await snapshot;
    const snapValue = snap.val();

    //  Inject snapvalue in the response
    return res.status(200).send({
      method: "sendMessage",
      chat_id,
      text: `${first_name}\n${receivedMessage}\n${snapValue}`,
    });
  }
  return res.status(200).send({status: "An error occured"});
});

export const router = functions.https.onRequest(bot);