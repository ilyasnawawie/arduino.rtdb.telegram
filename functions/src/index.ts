import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import * as admin from "firebase-admin";

admin.initializeApp();
const bot = express();

bot.use(cors({origin: true}));

bot.post("/", async function(req, res) {
  if (req.body && req.body.message && req.body.message.chat && req.body.message.chat.id && req.body.message.from && req.body.message.from.first_name) {
    const chat_id = req.body.message.chat.id;
    const first_name = req.body.message.from.first_name;
    const receivedMessage = req.body.message.text;

    // Define your RTDB Reference to point to the "Sensor MQ7" parent node
    const rtdbReference = admin.database().ref("Sensor MQ7");

    // Read the latest unknown child node of "Sensor MQ7"
    const latestUnknownChildNodeSnapshot = await rtdbReference.limitToLast(1).once("child_added");

    // Read the known child node of the unknown child node
    const knownChildNodeSnapshot = latestUnknownChildNodeSnapshot.child("MQ7");

    // Get the value of the known child node
    const knownChildNodeValue = knownChildNodeSnapshot.val();

    // Return the response
    return res.status(200).send({
      method: "sendMessage",
      chat_id,
      text: `${first_name}\n${receivedMessage}\n${knownChildNodeValue}`,
    });
  } else {
    // Return an error message if the request body is missing the required information
    return res.status(400).send({status: "An error occurred. The request body is missing the required information."});
  }
});

export const router = functions.https.onRequest(bot);
