import numpy as np
from boundary_conds import apply_BCs

def calc_Uf(U_star, V_star, mesh, rho, P, dt, dx, init_vals, cond_type):
    # Initilaize padded current pressure and velocity vals
    u_curr = np.zeros((U_star.shape[0]+2, U_star.shape[1]+2))
    v_curr = np.zeros((V_star.shape[0]+2, V_star.shape[1]+2))
    P_curr = np.zeros((P.shape[0]+2, P.shape[1]+2))
    u_curr[1:-1,1:-1] = U_star
    v_curr[1:-1,1:-1] = V_star
    P_curr[1:-1,1:-1] = P

    # Initialize unpadded new velocities
    u_next = np.zeros(U_star.shape)
    v_next = np.zeros(V_star.shape)

    # Apply pressure boundary conditions
    P_curr[:,-1] = P_curr[:,-2]
    P_curr[:,0] = P_curr[:,1]
    P_curr[0,:] = P_curr[1,:]
    P_curr[-1,:] = P_curr[-2,:]

    # Apply velocity BCs
    u_curr, v_curr = apply_BCs(u_curr, v_curr, mesh, init_vals, cond_type)


    # Update velocities
    u_next = u_curr[1:-1, 1:-1] - (dt/rho)*(1/dx)*(P_curr[1:-1,1:-1] - P_curr[:-2,1:-1])
    v_next = v_curr[1:-1, 1:-1] - (dt/rho)*(1/dx)*(P_curr[1:-1,1:-1] - P_curr[1:-1,:-2])

    return u_next, v_next

