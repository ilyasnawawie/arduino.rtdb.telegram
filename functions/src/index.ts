import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import * as admin from "firebase-admin";

admin.initializeApp();
const bot = express();

bot.use(cors({origin: true}));

bot.post("/", async function(req, res) {
  if (
    req.body &&
    req.body.message &&
    req.body.message.chat &&
    req.body.message.chat.id &&
    req.body.message.from &&
    req.body.message.from.first_name
  ) {
    const chat_id = req.body.message.chat.id;
    const first_name = req.body.message.from.first_name;
    const receivedMessage = req.body.message.text;

    // Check if the received message is the "/start" command
    if (receivedMessage === "/start") {
      // Define your RTDB Reference to point to the "Sensor MQ7" parent node
      const rtdbReference = admin.database().ref("Sensor MQ7");

      // Read the latest unknown child node of "Sensor MQ7"
      const latestUnknownChildNodeSnapshot = await rtdbReference
          .limitToLast(1)
          .once("child_added");

      // Read the known child nodes of the unknown child node
      const knownChildNodeSnapshot1 = latestUnknownChildNodeSnapshot.child("MQ7");
      const knownChildNodeSnapshot2 = latestUnknownChildNodeSnapshot.child("Time");
      const knownChildNodeSnapshot3 = latestUnknownChildNodeSnapshot.child("Location");

      // Get the values of the known child nodes
      const knownChildNodeValue1 = knownChildNodeSnapshot1.val();
      const knownChildNodeValue2 = knownChildNodeSnapshot2.val();
      const knownChildNodeValue3 = knownChildNodeSnapshot3.val();

      // Check if the known child node value is above 100
      if (knownChildNodeValue1 > 100) {
        // Return the response with a button interface
        return res.status(200).send({
          method: "sendMessage",
          chat_id,
          text: `${first_name} is in danger! Carbon Monoxide Concentration is too high: ${knownChildNodeValue1}. Last known location is at ${knownChildNodeValue3} approximately ${knownChildNodeValue2}.`,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `Call ${first_name}`,
                  callback_data: "call_user",
                },
              ],
            ],
          },
        });
      }
    }
  } else {
    // Return an error message if the request body is missing the required information
    return res.status(400).send({
      status: "An error occurred. The request body is missing the required information.",
    });
  }
  // Return an empty response
  return res.status(200).send({});
});

export const router = functions.https.onRequest(bot);
