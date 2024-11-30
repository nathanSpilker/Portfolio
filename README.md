# Portfolio
Nathan Spilker's project repository

## 6-DOF Simulation
During my time as CTO of Ravyn Technology, I developed this 6-DOF simulation software using Simulink. An image of the Simulink layout is in 6-DOF Simulation/Images, as well as sample outputs for an air-to-air missile, launched with an elevation of 45 degrees. The 6-DOF simulation code is in the file flat_earth_6dof.slx, and can be run for the air-to-air missile if tiw.mat is loaded into your MATLAB workspace. Closed loop controls are also included in the Simulink model, and control coefficients are in the .mat file.

## Thesis
As my undergraduate thesis, I designed and built a tri-copter VTOL delivery drone for 25lb. payloads and 600-mile range with Noah McGuinness and Noah Schocet. I performed a complete aircraft sizing, CFD, longitudinal stability analysis, and designed a VTOL flight controller. Our thesis won the John Marshall II 2nd place thesis prize within the Princeton MAE department. Thus far, the project has culminated in construction of multiple prototypes that were flown as a proof of concept for the aircraft configuration. 

## CFD Solver
As part of my Masters coursework, I took a class in scientific computing and numerical methods. My final project was a 2D incompressible Navier-Stokes solver. Different meshes and boundary conditions can be set to simulate a variety of scenarios. The code was also parallelized for faster runtime. A presentation outlining the algorithm and code in the CFD folder. 

## Optimal Control For Satellite Maneuvers

## Re-entry Vehicle Design

## Chaos Research - Lyapunov Exponents
Algorithm to find choatic 1D maps. Chaos can be defined as "Sensitive Dependence on Initial Conditions." The most famous and most studied chaotic 1D map is the logistic map: $`x 🡒 rx(1 - x)`$. One way this can be detected is with the Lyapunov exponent. For a given lambda value, if the Lyapunov exponent is positive, then the map is choatic. I created an algorithm that generates random 1D maps and calculate the Lyapunov exponent over a range of lambdas to detect if they have chaos. Three sample bifurcation plots are shown in the Chaos folder, plotted for maps discovered by this algorithm. One quite simple map that is chaotic that the algorithm discovered is $`x 🡒 \frac{rx}{\sqrt{r^4x^4 + 1}}`$.

## Pitch App
tourneyrules.app is a multiplayer web app where you can play the card game "Pitch." Pitch is one of my family's favorite card games and since I don't live close enough to play with them in person oftern, nor does the game exist in any other online players, I decided to develop it myself. The app uses websockets for a real-time multiplayer experience. Another part of this project was an AI pitch-player model. Using tensorflow, I used Deep Learning to create an model that can play the card game with comparable-to-human performance. The intention behind this was to fill up games where the required 4 humans weren't present to play the game.

## Autonomous Quadcopter Obstacle Course Navigation
As part of my Master's coursework at Princeton, my robotics final project was to write flight software for a quadcopter to fly through a randomized obstacle course, recognize an object, and land in front of it. This project used computer vision to recognize obstacles and objects, and the flight software was written to avoid the obstacles and fly toward the end, while staying within a boundary.

## packGenerator 
packGenerator.com was an idea I had in the summer of 2020. As an avid baseball card collector, I wanted to create an application where users could open randomly generated packs of baseball cards and build online collections. I first made a python web scraper using BeautifulSoup to scrape images and names of over half a million baseball cards. I created the web app with ReactJS and the backend was implemented on a Linux VPS with NGINX running a Python Flask backend script. I made an account and registration system as well as a personal baseball card collection system so users can keep the cards they pull out of packs. I store this data on MongoDB.

## Operation Space
Operation Space was an intercollegiate effort to send a two-stage, 18 foot, hypersonic, sounding rocket past the Karman Line. The engineering work was done by a small team of
engineers at Princeton University. I designed the interstage adapter and the nozzle expander/interstage interface for the second stage. I performed full assembly FEA on the two
stage vehicle. I was initimately familiar every single one of the 200+ components on the vehicle and oversaw construction of two, two-stage vehicles at Spaceport America. Helped conduct range safety protocols and ensured two successful launches.

## Erebus
Erebus was a 20 person team at Princeton University which designed a Lunar Lander to drill and analyze regolith for water on the south pole of the lunar surface and an accompanying Lunar communications orbiter. I was an elected team lead on this project, and was responsible for the science payload on the lander and propulsion systems on the orbiter. Through this project I learned many valuable lessons about engineering design and requirements workflow in a larger team. Some challenges I had to deal with were extreme temperature constraints in the shaded Shackleton crater and volatile sublimation. As for the orbiter, I worked with the GNC team to provide an adequate total impulse over the proposed mission with a hydrazine thruster.

## AutoCookie
This project was to design an algorithm that takes a clipart image as an input and outputs an "outline" image that can be used to create a 3D printable cookie cutter. The .exe file takes candidate.jpg, and transforms it into finished_prod.jpg, which can then be used to 3D print a cookie cutter.

## Coursework
These are examples of my coursework at Princeton University. Included here currently is General Relativity. 
