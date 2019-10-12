#include <WiFi.h>
#include <HTTPClient.h>
#include <SimpleDHT.h>
#define pinDHT11 2
SimpleDHT11 dht11;
#include <ArduinoJson.h>
#define led 4
const char* ssid = "Peter's Phone";
const char* password =  "25f5bd914aa9";

void setup() {
  pinMode (led, OUTPUT);
  Serial.begin(115200);
  delay(4000);   //Delay needed before calling the WiFi.begin
 
  WiFi.begin(ssid, password); 
 
  while (WiFi.status() != WL_CONNECTED) { //Check for the connection
    delay(1000);
    Serial.println("Connecting to WiFi..");
    digitalWrite(led,HIGH);
  }
  digitalWrite(led,LOW);
  Serial.println("Connected to the WiFi network");
}

void loop() {
  if(WiFi.status()== WL_CONNECTED){   //Check WiFi connection status
   HTTPClient http;   
   http.begin("http://192.168.43.199:8097/adddata");  //Specify destination for HTTP request
   http.addHeader("Content-Type", "application/json");//Specify content-type header
   
   // read with raw sample data.
  byte temperature = 0;
  byte humidity = 0;
  byte data[40] = {0};
  if (dht11.read(pinDHT11, &temperature, &humidity, data)) {
    Serial.print("Wires are not plugged in");
    return;
  }
  
  /*Serial.print("Sample RAW Bits: ");
  for (int i = 0; i < 40; i++) {
    Serial.print((int)data[i]);
    if (i > 0 && ((i + 1) % 4) == 0) {
      Serial.print(' ');
    }
  }*/
   String Stemp = String (temperature);
   String Shum = String (humidity);
   String Lat = String (42.484390);
   String Long = String (-71.191670);
   /*http.POST("{\"temperature\":");
   http.POST(Stemp);
   http.POST(",");
   http.POST("\"humidity\":");
   http.POST(Shum);
   http.POST("}");
   */
   http.POST("{\"temp\":" + Stemp + "," + "\"hum\":" + Shum +"," + "\"lat\": 42.484390," + "\"long\": -71.191670}");
   http.end();  //Free resources
  // DHT11 sampling rate is 1HZ.
  delay(30000);
}
}


 
