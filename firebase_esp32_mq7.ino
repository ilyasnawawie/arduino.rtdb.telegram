#include <WiFi.h>
#include <FirebaseESP32.h>

#define FIREBASE_HOST "gas-mq7-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "BIypPXRlYOeEdSb1vQoe3Bq7CX4OHOKJ6bWkI3yg"
#define WIFI_SSID     "ilyas"
#define WIFI_PASSWORD "qwerty123"

FirebaseData firebaseData;
FirebaseJson json;
int mq7 = 34;
int Vrdata = 0;
int buzzer = 14;
int red = 27;
int yellow = 26;
int green = 25;

const unsigned long eventInterval = 30000;
unsigned long previousTime = 0;

void setup()
{
  Serial.begin(115200);
  pinMode(mq7, INPUT);
  pinMode(red, OUTPUT);
  pinMode(yellow, OUTPUT);
  pinMode(green, OUTPUT);
  pinMode(buzzer, OUTPUT);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
  Serial.println("------------------------------------");
  Serial.println("Connected...");
}

void loop()
{
  Vrdata = analogRead(mq7);
  int Sdata = map(Vrdata, 0, 4095, 0, 1000);
  Serial.println(Sdata);
  
  unsigned long currentTime = millis();
  if (currentTime - previousTime >= eventInterval) {
    json.set("/MQ7", Sdata);
    Firebase.pushJSON(firebaseData, "/Sensor MQ7", json);
    Serial.println(Sdata);
    previousTime = currentTime;
  }
  
  if (Sdata > 0 && Sdata < 200)
  {
    digitalWrite(red, LOW);
    digitalWrite(yellow, LOW);
    digitalWrite(green, HIGH);
    digitalWrite(buzzer, LOW);
    Serial.println("Green led");
  }

  else if (Sdata > 201 && Sdata < 500)
  {
    digitalWrite(red, LOW);
    digitalWrite(yellow, HIGH);
    digitalWrite(green, LOW);
    digitalWrite(buzzer, LOW);
    Serial.println("Yellow led");
  }

  else if (Sdata > 501)
  {
    digitalWrite(red, HIGH);
    digitalWrite(yellow, LOW);
    digitalWrite(green, LOW);
    digitalWrite(buzzer, HIGH);
    Serial.println("red led and buzzer");
  }
}
