# Portfolio
Nathan Spilker's project repository

## Thesis
As my undergraduate thesis, I designed and built a tri-copter VTOL delivery drone for 25lb. payloads and 600-mile range with Noah McGuinness and Noah Schocet. I performed a complete aircraft sizing, CFD, longitudinal stability analysis, and designed a VTOL flight controller. Our thesis won the John Marshall II 2nd place thesis prize within the Princeton MAE department. Thus far, the project has culminated in construction of multiple prototypes that were flown as a proof of concept for the aircraft configuration. Here is an image of our aircraft configuration:
![fv2](https://github.com/user-attachments/assets/35154892-b31b-4803-bda7-c86088b9385b)

## CFD Solver
As part of my Masters coursework, I took a class in scientific computing and numerical methods. My final project was a 2D incompressible Navier-Stokes solver. Different meshes and boundary conditions can be set to simulate a variety of scenarios. The code was also parallelized for faster runtime. A presentation outlining the algorithm and code in the CFD folder. 
Here are sample velocity contours calculated for lid driven cavity flow:

<img src="https://github.com/user-attachments/assets/a1e209ad-08c7-4e12-914f-cdbc2d248878" width="410" /> <img src="https://github.com/user-attachments/assets/d6d944df-8566-48f1-9e5d-66355283ead6" width="410" />

## Operation Space
Operation Space was an intercollegiate effort to send a two-stage, 18 foot, hypersonic, sounding rocket past the Karman Line. The engineering work was done by a small team of
engineers at Princeton University. I was chief engineer for this project, specifically designing the interstage adapter and the nozzle expander/interstage interface for the second stage. I performed full assembly FEA on the two-stage vehicle. I was intimately familiar with every single one of the 200+ components on the vehicle and oversaw construction of two, two-stage vehicles at Spaceport America. Helped conduct range safety protocols and ensured two successful launches. I was the last person to touch the rocket before launch, removing the safety bars attaching the two stages. 

<p align="center">
<img src="https://github.com/user-attachments/assets/ceb01196-ca84-480a-94c6-a8e8b4648c84" width="600" />
</p>


## Re-entry Vehicle Design
My final project for my Masters course in Hypersonic Aerodynamics was to design a a blunt-body re-entry vehicle with three of my peers. The design process required us to solve for an entry path and velocity profile, calculate pressure coefficients around the vehicle, determine the aerothermodynamic and inertial loading, and ultimately design the thermal protection system (TPS). One of the tasks I performed for this project was writing an optimization algorithm to design the TPS material stack and thicknesses to meet a range of requirements. An image of the mesh of the blunt-body vehicle we studied is shown below. 
<p align="center">
<img src="https://github.com/user-attachments/assets/7eda1d95-58a2-4664-bad4-21feee5e397a" width="500" />
</p>


## Chaos Research - Lyapunov Exponents
Algorithm to find chaotic 1D maps. Chaos can be defined as "Sensitive Dependence on Initial Conditions." The most famous and most studied chaotic 1D map is the logistic map: $`x 🡒 rx(1 - x)`$. One way this can be detected is with the Lyapunov exponent. For a given lambda value, if the Lyapunov exponent is positive, then the map is chaotic. I created an algorithm that generates random 1D maps and calculate the Lyapunov exponent over a range of lambdas to detect if they have chaos. Three sample bifurcation plots are shown in the Chaos folder, plotted for maps discovered by this algorithm. One quite simple map that is chaotic that the algorithm discovered is $`x 🡒 \frac{rx}{\sqrt{r^4x^4 + 1}}`$. A bifurcation diagram for this map is shown below.

<p align="center">
<img src="https://github.com/user-attachments/assets/0cc1c4d3-e914-4563-811d-092836f91079" width="500" />
</p>

## 6-DOF Simulation
During my time as CTO of Ravyn Technology, I developed this 6-DOF simulation software using Simulink. An image of the Simulink layout is in 6-DOF Simulation/Images, as well as sample outputs for an air-to-air missile, launched with an elevation of 45 degrees. The 6-DOF simulation code is in the file flat_earth_6dof.slx, and can be run for the air-to-air missile if tiw.mat is loaded into your MATLAB workspace. Closed loop controls are also included in the Simulink model, and control coefficients are in the .mat file.
![6dof](https://github.com/user-attachments/assets/5fb26340-42eb-4cce-8bd4-5b2feaea6fea)

## Optimal Control For Satellite Maneuvers
This project was my Masters independent work. Under professor Ryne Beeson, my project was to solve for an optimal fuel trajectory for a satellite performing an orbital maneuver, subject to state uncertainty and path constraints. I derived the necessary conditions for optimality, then solved the two-point boundary problem for the optimal state and costate in MATLAB. The trajectory calculated is shown below.
<p align="center">
<img src="https://github.com/user-attachments/assets/b4fbde91-674b-422b-a5ab-bb4877f42004" width="400" />
</p>

## Pitch App
tourneyrules.app is a multiplayer web app where you can play the card game "Pitch." Pitch is one of my family's favorite card games and since I don't live close enough to play with them in person oftern, nor does the game exist in any other online players, I decided to develop it myself. The app uses websockets for a real-time multiplayer experience. Another part of this project was an AI pitch-player model. Using tensorflow, I used Deep Learning to create an model that can play the card game with comparable-to-human performance. The intention behind this was to fill up games where the required four humans weren't present to play the game.

## Autonomous Quadcopter Obstacle Course Navigation
As part of my Master's coursework at Princeton, my robotics final project was to write flight software for a quadcopter to fly through a randomized obstacle course, recognize an object, and land in front of it. This project used computer vision to recognize obstacles and objects, and the flight software was written to avoid the obstacles and fly toward the end, while staying within a boundary. Below is a video of our quadcopter navigating the obstacle course and landing in front of a book.

https://github.com/user-attachments/assets/d74dc309-0b58-456f-80df-c2e474ae5371

## packGenerator 
packGenerator.com was an idea I had in the summer of 2020. As an avid baseball card collector, I wanted to create an application where users could open randomly generated packs of baseball cards and build online collections. I first made a python web scraper using BeautifulSoup to scrape images and names of over half a million baseball cards. I created the web app with ReactJS and the backend was implemented on a Linux VPS with NGINX running a Python Flask backend script. I made an account and registration system as well as a personal baseball card collection system so users can keep the cards they pull out of packs. I store this data on MongoDB.

## Erebus
Erebus was a 20 person team at Princeton University which designed a Lunar Lander to drill and analyze regolith for water on the south pole of the lunar surface and an accompanying Lunar communications orbiter. I was an elected team lead on this project, and was responsible for the science payload on the lander and propulsion systems on the orbiter. Through this project I learned many valuable lessons about engineering design and requirements workflow in a larger team. Some challenges I had to deal with were extreme temperature constraints in the shaded Shackleton crater and volatile sublimation. As for the orbiter, I worked with the GNC team to provide an adequate total impulse over the proposed mission with a hydrazine thruster. Below is an image of our lander design.
<p align="center">
<img src="https://github.com/user-attachments/assets/bd42508b-0f9d-4528-aeb5-5b4c833360be" width="700" />
</p>


## AutoCookie
This project was to design an algorithm that takes a clipart image as an input and outputs an "outline" image that can be used to create a 3D printable cookie cutter. The .exe file takes candidate.jpg, and transforms it into finished_prod.jpg, which can then be used to 3D print a cookie cutter. Below is an example of a Pikachu clipart image turned into an outline that can then be converted to an STL file to be 3D printed. 
<img src="https://github.com/user-attachments/assets/2777597a-3ca3-4174-a4d4-62096f88d786" width="410" /> <img src="https://github.com/user-attachments/assets/1908cc04-9aa4-4480-9e40-fc0bff7c6061" width="410" />

## Coursework
These are examples of my coursework at Princeton University. Included here currently is General Relativity. 
