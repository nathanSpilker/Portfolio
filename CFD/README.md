# APC523 Final Project : Navier Stokes Solver 
Kevin Andrade and Nathan Spilker



## Description
This package solves the Navier Stokes equation on a 2D mesh using an implicit algorithm. There are two working versions of the solver located in the "Nonparallel Version" and "Parallel Version" directories. The former directory includes non-parallel solver methods for the Pressure Poisson, while the latter includes their parallel versions. 
The code outputs velocity contour plots and streamline plots. U.dat and V.dat contain the velocity solutions.

## Build/Run Instructions for Non-Parallel Version
The code takes in the following input file: 

    input.json
    
To run the non-parallel version of the code, the user needs to be in the "Non-Parallel Version" directory and needs to run the following command: 

    python navier_stokes_solver.py input.json
    
## Build/Run Instructions for Parallel Version
The code takes in the following input file: 

    input.json

This input file is located within the bashscript, so only the only command line argument neccesary is the number of processors ([num_processors]). The parallel code requires the MPI for Python package (mpi4py). This can be installed using (after loading the appropriate gcc library):

    module load anaconda3/2021.5
    module load openmpi/gcc/4.1.0
    pip install mpi4py

  
To run the parallel version of the code, the user needs to be in the "Parallel Version" directory and needs to run the following command: 

    bash ns_solver.sh [num_processors]
