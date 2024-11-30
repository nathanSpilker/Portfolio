import numpy as np
from boundary_conds import apply_BCs

def ppoisson_rhs(u, v, dx, dy, dt, rho):
    # Calculate rhs for pressure poisson
    rhs = np.zeros(u.shape)
    rhs = (rho/dt) * ((u[2:,1:-1]-u[1:-1, 1:-1])/dx + (v[1:-1,2:]-v[1:-1,1:-1])/dy)
    return rhs

def calc_rhs(U_star, V_star, rho, dt, dx, dy, init_vals, cond_type):
    # Initialize velocities 
    u = np.zeros((U_star.shape[0] + 2, U_star.shape[0] + 2))
    v = np.zeros((V_star.shape[0] + 2, V_star.shape[0] + 2))
    u[1:-1, 1:-1] = U_star
    v[1:-1, 1:-1] = V_star

    # Apply BCs
    u,v = apply_BCs(u, v, init_vals, cond_type)

    # Calculate rhs
    rhs = ppoisson_rhs(u,v,dx,dy,dt,rho)

    return rhs