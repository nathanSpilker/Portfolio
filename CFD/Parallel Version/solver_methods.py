import numpy as np
from jacobi_solver import jacobi
from gauss_seidel_solver import gauss_seidel
from rhs_calculator import calc_rhs

# Execute Pressure Poisson Solver
def solve_poisson(input_solver, U_star, V_star, rho, dt, dx, dy, init_vals, cond_type, EPS, MAXITR, comm, size, rank):
    if (input_solver == "jacobi"):
        solver = jacobi
    elif(input_solver == "direct_inversion"):
        solver = d_inversion
    elif (input_solver == "gauss_seidel"):
        solver = gauss_seidel
    else:
        raise Exception("Solver type not found")

    if rank == 0:
        rhs = calc_rhs(U_star, V_star, rho, dt, dx, dy, init_vals, cond_type)
    else: rhs = U_star
    
    P_sol = solver(rhs, dx, EPS, MAXITR, comm, rank, size)
    return P_sol