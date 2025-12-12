---
layout: post
title: Robotic Violin
description: Conducted a full design and build of a robotic violin capable of performing musical arrangements in response to WiFi UDP signals, integrating mechanical and electrical systems. Developed CATIA models and laser cut acrylic components, and implemented ESP32 based control using Arduino to drive servos and DC actuators for bowing and fingering motions.
skills: 
  - CATIA
  - Arduino
  - Electronics
  - Breadboarding
  - Laser Cutting

main-image: /violin.png
---
## CAD
---
## Code
```C
#include <WiFi.h>
#include <WiFiUdp.h>
#define ONEmS_COUNTS ((1 << 12) * 50 / 1000)
void setup() {
 Serial.begin(115200);
 WiFi.begin("TP-Link_E0C8", "52665134");
 WiFi.config(IPAddress(192, 168, 1, 63),
 IPAddress(192, 168, 1, 1),
 IPAddress(255, 255, 255, 0));
 while (WiFi.status() != WL_CONNECTED) {
 delay(500);
 Serial.print(".");
 }
 Serial.println("WiFi connected");
 UDPTestServer.begin(2808); // 2808 arbitrary UDP port#
}
void loop() {
 handleUDPServer();
 delay(1);
}
void handleUDPServer() {
 char packetBuffer[100]; // can be up to 65535
 int cb = UDPTestServer.parsePacket();
 if (cb) {
 int len = UDPTestServer.read(packetBuffer, 100);
 packetBuffer[len] = 0;
 Serial.printf("%s", packetBuffer);
 }
}
//Sync
void loop() {
 int msg = checkUDP();// do nothing
 if (msg == 0);// test sync "T"
 else if (msg == 1) {
 playOnenote1sec();
 }
 // Go message "G"
 else if (msg == 2) {
 startSong();
 }
 delay(1);
}
int checkUDP() {
 char packetBuffer[100];
 int cb = UDPTestServer.parsePacket();
 if (cb) {
 int len = UDPTestServer.read(packetBuffer, 100);
 packetBuffer[len] = 0;
 Serial.printf("%s", packetBuffer);
 if (packetBuffer[0] == 'T') return 1;
 if (packetBuffer[0] == 'G') return 2;
 }
 return 0;
}
 //Note
 int min_counts = ONEmS_COUNTS; // conservative is 1mS for minimum
int max_counts = 1.5 * ONEmS_COUNTS;
void setup() {
 ledcSetup(0, 50, 12);
 ledcAttachPin(0, 0);
 ledcSetup(1, 50, 12);
 ledcAttachPin(1, 1);
 ledcSetup(2, 50, 12);
 ledcAttachPin(5, 2);
 ledcSetup(3, 50, 12);
 ledcAttachPin(4, 3);
 Serial.begin(9600);
}
//cover/ open
void cover(int chan) {
 // code for different servos:
 for (int i = min_counts; i < max_counts; i++) {
 ledcWrite(chan, i); // sweep servo forward
 delayMicroseconds(1000); // need this 20mS for 1 cycle at 50Hz
 }
}
void lift(int chan) {
 for (int j = max_counts; j > min_counts; j--) {
 ledcWrite(chan, j); // sweep servo back
 delayMicroseconds(1000); // need this 20mS for 1 cycle at 50Hz
 }
}
void playSequence() {
 cover(1);
 lift(3);
 cover(0);
 delay(500);
 lift(1);
 delay(400);
 lift(2);
 delay(300);
 cover(1);
 delay(250);
 cover(3);
 cover(2);
 lift(1);
 delay(2000);
 lift(0);
 cover(3);
}
void debug0() {
 cover(1);
 delay(3000);
 lift(1);
 delay(3000);
}
void debug1() {
 cover(2);
 delay(3000);
 lift(1);
 delay(3000);
}
void loop() {
 playSequence();
}
```
---



