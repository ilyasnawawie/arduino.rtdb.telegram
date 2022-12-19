import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import * as admin from "firebase-admin";

admin.initializeApp();
const bot = express();
bot.use(cors({origin: true}));

bot.post("/", async (req, res) => {
  if (req.body && req.body.message && req.body.message.chat && req.body.message.chat.id && req.body.message.from && req.body.message.from.first_name) {
    const chatId = req.body.message.chat.id;
    const userName = req.body.message.from.first_name;
    const message = req.body.message.text;

    if (message === "/start") {
      const rtdbRef = admin.database().ref("Sensor MQ7");
      const latestUnknownChildSnapshot = await rtdbRef.limitToLast(1).once("child_added");
      const coConcentrationSnapshot = latestUnknownChildSnapshot.child("MQ7");
      const latitudeSnapshot = latestUnknownChildSnapshot.child("latitude");
      const longitudeSnapshot = latestUnknownChildSnapshot.child("longitude");
      const timeSnapshot = latestUnknownChildSnapshot.child("time");
      const coConcentration = coConcentrationSnapshot.val();
      const latitude = latitudeSnapshot.val();
      const longitude = longitudeSnapshot.val();
      const time = timeSnapshot.val();

      if (coConcentration > 100) {
        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        const encodedMapsLink = encodeURI(mapsLink);

        return res.status(200).send({
          method: "sendMessage",
          chat_id: chatId,
          text: `${userName} mungkin berada dalam bahaya. Konsentrasi Carbon Monoxida tinggi dikesan pada skala ${coConcentration}ppm. Lokasi terakhir adalah (${encodedMapsLink}) pada waktu ${time}.`,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Maklumat Lanjut",
                  url: "https://mq7fyp.000webhostapp.com/",
                },
              ],
            ],
          },
        });
      }
    }
  } else {
    return res.status(400).send({
      status: "An error occurred. The request body is missing the required information.",
    });
  }
  return res.status(200).send({});
});

export const router = functions.https.onRequest(bot);
