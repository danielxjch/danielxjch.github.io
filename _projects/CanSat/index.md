---
layout: post
title: CanSat
description:  Designed and built a satellite system for atmospheric data collection and periodic transmission to a Yagi antenna ground station. Implemented a controlled landing sequence using a parachute cutaway mechanism and deployable drone propellers, triggered by emulated SBUS receiver protocol from an onboard microcontroller to modify flight controller settings.
skills: 
  - Fusion360
  - Arduino
  - Soldering
  - Breadboard
  - Electronics
  - Drone Components (Flight Controller, ESC)
  - Signal Processing

main-image: /CanSat_extended2.png
decor: cansat
---
{% include image-gallery.html images="CanSat_main.png" height="700" %}

The Canadian Satellite Design Challenge sets a deceptively small brief: build a fully functional satellite that fits inside a standard soda can. Ours held to the can's outer dimensions, minus the rounded fillets, which bought a little extra internal volume, inside a required 300 to 350 g mass budget. We came in at exactly 300 g, staying as light as the rules allowed because every gram mattered to the landing system.

The science payload was deliberately conventional. Onboard sensors logged atmospheric temperature and pressure through the flight, roughly 1,000 readings per channel. The harder engineering went into how the can came home.

---
## Autonomous landing system
Once ejected from the rocket, the capsule descended under a parachute. The lid was tethered to the body with fishing line, with enough slack to swing clear, and while it was seated it physically held the spring-loaded rotor arms folded against the can. Parachute deployment pulled the lid away, and the arms sprang open into a quadrotor.

At roughly 200 m, a resistor heated up and burned through the fishing line, cutting the parachute free. With the canopy gone, the flight controller and ESC switched into a powered landing mode and flew the vehicle down under its own rotors: a folded soda can that unpacks itself into a drone on the way down.

{% include image-gallery.html images="CanSat_extended.png" height="700" %}
*Four spring-loaded arms carry the rotors; the central stack holds the flight controller, ESC, and Adafruit RFM9x LoRa radio, powered by an 850 mAh LiPo.*

The altitude trigger ran off a barometer calibrated before launch, with the flight's own apogee reading used to anchor a rough altitude reference. When the estimate crossed the 200 m threshold, the cutaway and landing sequence fired.

---
## Emulating the receiver
The whole mission had to run autonomously. Competition rules prohibit any signal from the ground station back to the CanSat, and a conventional RC receiver would have cost space and mass we didn't have. But the flight controller only accepts commands through its receiver input pins.

So we skipped the receiver. GPIO pins on an Arduino Nano were soldered directly to the flight controller's receiver inputs, and the Nano emulated the receiver's SBUS signal itself. Working from the flight controller's documentation, we generated exactly the SBUS frame needed to switch it into landing mode at the right moment. The flight controller still handled stabilization and motor control; it just took its orders from a microcontroller impersonating an RC link instead of a pilot.

---
## Telemetry and ground station
Throughout the flight the CanSat periodically transmitted its atmospheric readings over an Adafruit LoRa transceiver and omnidirectional antenna. On the ground, a Yagi antenna picked up the downlink and logged it as raw CSV, which we imported into Logger Pro to graph and analyze the flight: roughly 1,000 points each of temperature and pressure against altitude.

---
## Structure
The airframe was modeled in Fusion 360 over five to six design iterations, tightening the fit of the folding-arm mechanism and the internal stack against the can's unforgiving volume budget.
{% include image-gallery.html images="CanSat_CAD.png" height="700" %}

---
## Code
{% include image-gallery.html images="CanSat_code.png" height="700" %}

---
## Result
The CanSat flew the full sequence and took home the competition's **Technical Achievement Award**.
