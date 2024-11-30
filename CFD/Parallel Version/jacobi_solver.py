import numpy as np
import matplotlib.pyplot as plt
from mpi4py import MPI
import time 

def jacobi_parallel(f, dx, EPS, MAXITR, comm, rank, size):
    
    if rank == 0:
        n_y = f.shape[1]
        l_y = int(np.floor(n_y/size))

        # Extra indices
        ex = n_y - l_y*size

        # Add data 
        data = []
        for i in range(size):
            if i == 0:
                data.append(f[:, i*l_y:(i+1)*l_y + ex])
            else:
                data.append(f[:, i*l_y+ex:(i+1)*l_y + ex])
    
    else: data = np.empty(f.shape)


    data = comm.scatter(data, root = 0)
    U_local = np.zeros((data.shape[0] + 2, data.shape[1] + 2))
    f_local = np.zeros((data.shape[0] + 2, data.shape[1] + 2))
    f_local[1:-1,1:-1] = data

    # Initialize solver params
    U_next = np.zeros(U_local.shape)
    gerr = np.infty
    itr = 0

    # Execute solvers
    while itr < MAXITR and gerr > EPS:

        U_next[1:-1, 1:-1] = (1/4)*(U_local[2:,1:-1] + U_local[0:-2,1:-1] + U_local[1:-1,2:] + U_local[1:-1,:-2] - dx**2*(f_local[1:-1,1:-1]))

        # Neumann boundary conditions
        U_next[:,0] = U_next[:,1]
        U_next[-1,:] = U_next[-2,:]
        U_next[:,-1] = U_next[:,-2]
        U_next[0,:] = U_next[1,:]

        U_next = share_ghost(rank, comm, size, U_next)

        err = np.max(abs(U_next - U_local))
        
        # Swap pointers
        U_local[:,:] = U_next[:,:]

        # Error calculation
        lerr = np.zeros(size)
        all_err = np.zeros(size)
        for k in range(size):
            if rank == k:
                lerr[k] = err


        comm.Allreduce(lerr, all_err)
        gerr = np.max(all_err)
        itr+=1


    s_arr = np.copy(U_local[1:-1,1:-1])
    ret = comm.gather(s_arr, root = 0)

    if rank == 0:
        Usol = np.concatenate(ret, axis=1)
        return Usol

            
# Communication between ghost cells
def share_ghost(rank, comm, size, U_next):
    s1 = np.array(U_next[:,-2])
    s2 = np.array(U_next[:,1])
    
    if rank == 0 and size != 1:
        comm.Isend([s1, MPI.DOUBLE], dest=1, tag=0)

    elif rank < size - 1:
        comm.Isend([s2, MPI.DOUBLE], dest=rank-1, tag=rank)
        comm.Isend([s1, MPI.DOUBLE], dest=rank+1, tag=rank)

    elif rank == size - 1 and size != 1:
        comm.Isend([s2, MPI.DOUBLE], dest=rank-1, tag=rank)

    ghost_below = np.copy(s1)
    ghost_above = np.copy(s2)

    if rank == 0 and size != 1:
        req = comm.Irecv([ghost_below, MPI.DOUBLE], source=1, tag=rank+1)
        req.wait()

    elif rank < size - 1:
        req1 = comm.Irecv([ghost_above, MPI.DOUBLE], source=rank-1, tag=rank-1)
        req2 = comm.Irecv([ghost_below, MPI.DOUBLE], source=rank+1, tag=rank+1)
        req1.wait()
        req2.wait()

    elif rank == size - 1 and size != 1:
        req = comm.Irecv([ghost_above, MPI.DOUBLE], source=rank-1, tag=rank-1)
        req.wait()

    U_next[:,0] = ghost_above.squeeze()
    U_next[:,-1] = ghost_below.squeeze()

    return U_next



def jacobi(f, dx, EPS, MAXITR, comm, rank, size):           
    P_sol = jacobi_parallel(f, dx, EPS, MAXITR, comm, rank, size)
    return P_sol
