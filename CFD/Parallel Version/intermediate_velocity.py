import numpy as np
from boundary_conds import apply_BCs


def calc_dpartials(u_curr, v_curr, nu, dt, dx, dy):
    # Initialize discrete u terms
    u_i_j = u_curr[1:-1,1:-1]
    u_im1_j = u_curr[:-2,1:-1]
    u_ip1_j = u_curr[2:,1:-1]
    u_i_jp1 = u_curr[1:-1,2:]
    u_i_jm1 = u_curr[1:-1,:-2]
    u_ip1_jm1 = u_curr[2:,:-2]

    # Initialize discrete v terms
    v_i_j = v_curr[1:-1,1:-1]
    v_im1_j = v_curr[:-2,1:-1]
    v_ip1_j = v_curr[2:,1:-1]
    v_i_jp1 = v_curr[1:-1,2:]
    v_i_jm1 = v_curr[1:-1,:-2]
    v_im1_jp1 = v_curr[:-2,2:]

    # Initialize u discrete partial derivatives
    dudx2 = (u_im1_j - 2 * u_i_j + u_ip1_j)/dx**2
    dudy2 = (u_i_jm1 - 2 * u_i_j + u_i_jp1)/dy**2
    u_dudx =  u_i_j * (u_ip1_j - u_im1_j)/(2*dx)
    v_dudy = 0.25 * (v_im1_j + v_i_j + v_im1_jp1 + v_i_jp1) * (u_i_jp1 - u_i_jm1)/(2*dy)

    # Initialize v discrete partial derivatives
    dvdx2 = (v_im1_j - 2 * v_i_j + v_ip1_j)/dx**2
    dvdy2 = (v_i_jm1 - 2 * v_i_j + v_i_jp1)/dy**2
    u_dvdx = 0.25 * (u_i_jm1 + u_i_j + u_ip1_jm1 + u_ip1_j) * (v_ip1_j - v_im1_j)/(2*dx)
    v_dvdy =  v_i_j * (v_i_jp1 - v_i_jm1)/(2*dy)

    # Calculate intermediate velocity 
    u_star = u_curr[1:-1,1:-1] + dt*(nu*(dudx2 + dudy2) - (u_dudx + v_dudy))  
    v_star = v_curr[1:-1,1:-1] + dt*(nu*(dvdx2 + dvdy2) - (u_dvdx + v_dvdy))  

    return [u_star, v_star]


def calc_Ui(U, V, nu, dt, dx, dy, init_vals, cond_type):
    # Initialize current padded velocities 
    u_curr = np.zeros((U.shape[0] + 2, U.shape[1] + 2))
    v_curr = np.zeros((V.shape[0] + 2, V.shape[1] + 2))
    u_curr[1:-1, 1:-1] = U
    v_curr[1:-1, 1:-1] = V
    dy = dx
    
    # Initialize new padded velocities 
    u_star = np.zeros(U.shape)
    v_star = np.zeros(V.shape)

    # Update boundary conditions
    u_curr, v_curr = apply_BCs(u_curr, v_curr, init_vals, cond_type)

    # Calculate discretized partial derivatives
    u_star, v_star = calc_dpartials(u_curr, v_curr, nu, dt, dx, dy)

    return u_star, v_star
