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
    const chatId = req.body.message.chat.id;
    const userName = req.body.message.from.first_name;
    const message = req.body.message.text;

    // Check if the received message is the "/start" command
    if (message === "/start") {
      // Define your RTDB Reference to point to the "Sensor MQ7" parent node
      const rtdbRef = admin.database().ref("Sensor MQ7");

      // Read the latest unknown child node of "Sensor MQ7"
      const latestUnknownChildSnapshot = await rtdbRef
          .limitToLast(1)
          .once("child_added");

      // Read the known child nodes of the latest unknown child node
      const coConcentrationSnapshot = latestUnknownChildSnapshot.child("MQ7");
      const latitudeSnapshot = latestUnknownChildSnapshot.child("latitude");
      const longitudeSnapshot = latestUnknownChildSnapshot.child("longitude");
      const timeSnapshot = latestUnknownChildSnapshot.child("time");

      // Get the values of the known child nodes
      const coConcentration = coConcentrationSnapshot.val();
      const latitude = latitudeSnapshot.val();
      const longitude = longitudeSnapshot.val();
      const time = timeSnapshot.val();

      // Check if the known child node value is above 100
      if (coConcentration > 100) {
        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        const encodedMapsLink = encodeURI(mapsLink);
        // Return the response with a button interface
        return res.status(200).send({
          method: "sendMessage",
          chat_id: chatId,
          text: `${userName} mungkin berada dalam bahaya. Tahap konsentrasi karbon monoksida pada masa ini adalah ${coConcentration}. Lokasi terakhir ada di (${encodedMapsLink}) pada pukul ${time}.`,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `Call ${userName}`,
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
