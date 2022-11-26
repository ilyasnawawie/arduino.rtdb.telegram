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
    const mq7ref = rtdbReference.child("-NHi7dBPMlVi6hXrnI03");
    const valref = mq7ref.child("MQ7");
    //  Fetch the data
    const snap = await valref.get();
    const snapValue = snap.val();
    //  Do whatever you need with snapValue to inject it in your response...

    return res.status(200).send({
      method: "sendMessage",
      chat_id,
      text: `${first_name}, \n  ${receivedMessage} \n ${snapValue}`,
    });
  }
  return res.status(200).send({status: "An error occured"});
});

export const router = functions.https.onRequest(bot);
