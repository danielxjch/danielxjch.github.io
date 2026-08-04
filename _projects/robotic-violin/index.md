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
decor: violin
---

The robotic violin was built during the University of Pennsylvania's ESAP robotics program, a course run by Dr. Mark Yim and modeled on a graduate-level Penn robotics class, as one instrument in a synchronized robotic ensemble. Working as a two-person team, we bought an old violin off Facebook Marketplace and built the whole machine in under a week, tuning it to play a recognizable arrangement of "Demons" by Imagine Dragons for the final demonstration.

---
## Bowing
Bowing is the hard part of any robotic string instrument: you need continuous, even contact to draw a sustained note. Instead of a conventional bow, we ran a **continuous loop of rosined fishing line** between two motors, riding across a single string. The motors drove the loop around endlessly, so the string was always being bowed. The line's natural slack let it conform to the string, and a spring held it in place to supply steady bow pressure.

Getting a clean tone came down to balancing the tension in the fishing-line loop against the spring pressure on the string. One detail mattered more than expected: the knot joining the loop. Left as it was, it would catch and pluck the string each time it came around, so we fused and smoothed it with a soldering iron until it passed silently.

---
## Fingering
Pitch is set by a **servo array positioned along one string**. Each servo arm presses the string directly down onto the fingerboard, padded with hot glue, at a fixed position marked with masking tape, so once the open string is tuned, each servo lands a specific note. The mechanism was designed around exactly the notes the arrangement needed, covering a bit more than an octave within its key.

Only one note is fully held at a time, but the servo timing overlaps to imitate how a real violinist works: the next, lower note begins moving toward the string while the current, higher note is still held, so releasing the higher finger lets the already-prepared one engage without an audible gap.

{% include image-gallery.html images="Violin CAD.PNG" height="400" %}

---
## Playing in an ensemble
The violin was one of several robotic instruments performing together, kept in time over WiFi. Every instrument joined the same network, and a teacher-controlled conductor sent UDP packets to the group; our system only had to listen. A test/sync command prepared the instrument and confirmed communication, and a **go** command started the piece. The full arrangement and its timing were programmed and stored locally on an ESP microcontroller, so once the start packet arrived the violin played autonomously, in sync with the rest of the ensemble.

---
## Performance
{% include youtube-video.html id="mOd76fNrCOg" autoplay="false" %}

The finished instrument performed consistently, playing a recognizable "Demons" in time with the ensemble, and the whole thing was built end to end in under a week. According to the program, no previous team, in the high-school program or the graduate course it was modeled on, had attempted a robotic violin.
