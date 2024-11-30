import numpy as np
from jacobi_solver import jacobi
from gauss_seidel_solver import gauss_seidel
from rhs_calculator import calc_rhs


# Execute Pressure Poisson Solver
def solve_poisson(input_solver, U_star, V_star, mesh, rho, dt, dx, dy, init_vals, cond_type, EPS, MAXITR):
    if (input_solver == "jacobi"):
        solver = jacobi
    elif (input_solver == "gauss_seidel"):
        solver = gauss_seidel
    else:
        raise Exception("Solver type not found")

    rhs = calc_rhs(U_star, V_star, mesh, rho, dt, dx, dy, init_vals, cond_type)
    P_sol = solver(rhs, dx, EPS, MAXITR)
    return P_sol