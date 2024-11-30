#!/bin/bash
module load anaconda3/2021.5
module load openmpi/gcc/4.1.0


echo "Running Navier Stokes Solver"
mpiexec -n $1 python navier_stokes_solver.py input.json