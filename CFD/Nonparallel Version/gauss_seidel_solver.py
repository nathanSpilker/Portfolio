import numpy as np
import time



def gauss_seidel_nparallel(f, dx, EPS, MAXITR):
    # Initialize parameters
    n_x = f.shape[0]
    n_y = f.shape[1]
    P_curr = np.zeros((n_x+2,n_y+2))
    P_next = np.zeros((n_x+2,n_y+2))
    itr = 0
    err = np.infty

    x_open = int(np.floor((n_x+2)/2))
    y_open = int(np.floor((n_y+2)/2))

    # Run Gauss-Seidel scheme
    while itr < MAXITR and EPS < err:

        for i in range(0, n_x):
            for j in range(0, n_y):
                P_next[i,j] = (1/4)*(P_curr[i+1,j] +\
                    P_curr[i-1,j]+ P_curr[i,j+1] + P_curr[i,j-1] -\
                    dx**2*f[i-1,j-1])
      
        # Apply pressure boundary conditions
        P_next[:,-1] = P_next[:,-2]
        P_next[:,0] = P_next[:,1]
        P_next[0,:] = P_next[1,:]
        P_next[-1,:] = P_next[-2,:]


        # Calculate error
        err = np.max(abs(P_next - P_curr))
        P_curr[:,:] = P_next[:,:]
        itr += 1

    return P_next[1:-1, 1:-1]


def gauss_seidel(f, dx, EPS, MAXITR):           
    P_sol = gauss_seidel_nparallel(f, dx, EPS, MAXITR)
    return P_sol
