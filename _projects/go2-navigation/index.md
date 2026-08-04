---
layout: post
title: Go2 Quadruped Navigation
description:  Implemented an ego-circle/cylinder based navigation strategy for the Go2 quadruped robot using ROS2. Developed custom Gazebo environments to evaluate LiDAR performance across varied obstacles, visualized simulation results in RViz, and designed SolidWorks mounts for third party computing hardware and sensors.
skills: 
  - ROS
  - Gazebo
  - RViz
  - Linux
  - C++
  - Python
  - SolidWorks

main-image: /Go2_main.png
decor: go2
---

The **QuadNav** project at the Georgia Tech LiDAR Lab asks a Unitree Go2 quadruped to navigate from goal to goal through dynamic, changing environments. My part of the ongoing effort was adapting an existing 2D navigation planner to work on four legs, bridging the gap between what the robot's sensor sees and what the planner was built to understand.

---
## From ego-cylinder to ego-circle
The Go2's LiDAR produces an *ego-cylinder*: a 3D, robot-centered scan of the surrounding space out to a set depth. The navigation planner, though, was originally written for largely 2D navigation and expects an *ego-circle*, a flat robot-centered ring of nearest-obstacle distances by bearing.

My work was the conversion between the two. I collapsed the 3D ego-cylinder into a 2D ego-circle using a vertical band sized mainly to the Go2's own height: returns inside the band (the things the robot could actually collide with) are kept, and everything above or below its collision envelope is discarded. The harder half was what came after: processing the resulting circle to find *dynamic gaps* (openings between obstacles that change in real time) the robot could steer through. No machine learning is involved in this portion of the pipeline; it is geometry and filtering.

{% include image-gallery.html images="Egocylinder.png" height="500" %}
{% include image-gallery.html images="Egocircle.png" height="400" %}

---
## Navigation pipeline
The full loop runs end to end. A LiDAR scan (from either the physical sensor or a Gazebo-simulated one) produces the ego-cylinder; the vertical-range filter reduces it to a robot-relevant ego-circle; the planner detects dynamic gaps, selects a viable heading, and emits the navigation commands. I ran these simulations end to end, and the same pipeline was exercised regularly on the physical robot in live testing.

{% include image-gallery.html images="RViz_scan.png" height="600" %}

---
## Simulation environments
Early testing used pre-existing Gazebo worlds, but general environments made it hard to tell *why* a run failed. So I built simplified environments that isolate one navigation case at a time, such as hallways, corners, stairs, and other basic geometric layouts, and used them to check the cylinder-to-circle conversion, dynamic-gap detection, and overall navigation behavior independently, watching specifically whether the robot found a usable gap and took it.

---
## Sensor and compute mounts
Carrying the added hardware meant designing custom SolidWorks mounts for the physical Go2 (for the onboard computer, the battery, and the cameras), then printing them and fitting them to the robot.

{% include image-gallery.html images="go2_sensors.jpg" height="500" %}
*The compute enclosure, battery, and camera mounts installed on the Go2.*

The most recent revision is a LiDAR mount that replaces the robot's stock lid, letting the sensor sit up top with a clear field of view. It is currently in testing.

{% include image-gallery.html images="go2_lidar.jpg" height="500" %}
*The LiDAR mount: a drop-in replacement for the stock lid.*

---
## Stack
- **ROS 2 Humble**, with C++ and Python
- Gazebo for simulation, RViz for visualization
- Runs against both simulated and physical LiDAR, with live testing on a Unitree Go2
