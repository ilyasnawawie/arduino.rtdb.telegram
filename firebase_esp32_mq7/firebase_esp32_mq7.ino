#include <WiFi.h>
#include <FirebaseESP32.h>
#include <TimeLib.h>
#include <Timezone.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>

#define FIREBASE_HOST "gas-mq7-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "BIypPXRlYOeEdSb1vQoe3Bq7CX4OHOKJ6bWkI3yg"
#define WIFI_SSID "Ilyas"
#define WIFI_PASSWORD "qwerty123"

FirebaseData firebaseData;
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);
TinyGPSPlus gps;

int mq7 = 34;
int buzzer = 14;
int red = 27;
int yellow = 26;
int green = 25;

void setup() {
  // Initialize serial connection
  Serial.begin(115200);
  Serial1.begin(9600, SERIAL_8N1, 32, 33);

  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  // Initialize time client
  timeClient.begin();
  timeClient.setTimeOffset(28800); // Set time offset to GMT+8 for Malaysia

  // Initialize Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
}

void loop() {
  // Read sensor data
  int Vrdata = analogRead(mq7);
  int Sdata = map(Vrdata, 0, 4095, 0, 1000);
  Serial.println(Sdata);

  // Update time and location
  timeClient.update();
  while (Serial1.available() > 0) {
    gps.encode(Serial1.read());
  }

  // Check if time and location are valid
  if (timeClient.getFormattedTime() != "") {
    // Create JSON object with time, location, and sensor data
    FirebaseJson json;
    json.set("/time", timeClient.getFormattedTime());
    json.set("/latitude", gps.location.lat());
    json.set("/longitude", gps.location.lng());
    json.set("/MQ7", Sdata);

    // Push data to Firebase
    if (Firebase.pushJSON(firebaseData, "/Sensor MQ7", json)) {
      Serial.println("Pushed to Firebase");
    } else {
      Serial.println("Push failed");
      Serial.println(firebaseData.errorReason());
    }
  }

  // Control LEDs and buzzer
  if (Sdata > 0 && Sdata < 200) {
    digitalWrite(red, LOW);
    digitalWrite(yellow, LOW);
    digitalWrite(green, HIGH);
    digitalWrite(buzzer, LOW);
    Serial.println("Green led");
  } else if (Sdata > 201 && Sdata < 500) {
    digitalWrite(red, LOW);
    digitalWrite(yellow, HIGH);
    digitalWrite(green, LOW);
    digitalWrite(buzzer, LOW);
    Serial.println("Yellow led");
  } else if (Sdata > 501) {
    digitalWrite(red, HIGH);
    digitalWrite(yellow, LOW);
    digitalWrite(green, LOW);
    digitalWrite(buzzer, HIGH);
    Serial.println("red led and buzzer");
  }
}
