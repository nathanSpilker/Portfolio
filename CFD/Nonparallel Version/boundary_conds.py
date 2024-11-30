import numpy as np

def apply_BCs(u, v, mesh, init_vals, cond_type): 
    u_bar = np.copy(u)
    v_bar = np.copy(v)
    
    if cond_type == "lid_driven_cavity":
        u_init = init_vals[0]
        u_bar[:,0] = 0
        u_bar[:,-1] = 0
        u_bar[0,:] = 0
        u_bar[-1,:] = 0
        
        u_bar[0,0] = 0
        u_bar[0,-1] = 0
        u_bar[-1,0] = 0
        u_bar[-1,-1] = 0

        v_bar[:,-1] = 0
        v_bar[:,0] = 0
        v_bar[0,:] = 0
        v_bar[-1,:] = u_init
        
        v_bar[0,0] = 0
        v_bar[0,-1] = 0
        v_bar[-1,0] = 0
        v_bar[-1,-1] = 0

    if cond_type == "duct":
        u_bar[:,0] = u_bar[:,1]
        u_bar[:,-1] = u_bar[:,-2]
        u_bar[0,:] = 0
        u_bar[-1,:] = 0
        
        u_bar[0,0] = 0
        u_bar[0,-1] = 0
        u_bar[-1,0] = 0
        u_bar[-1,-1] = 0

        v_bar[:,-1] = v_bar[:,-2]
        v_bar[:,0] = v_bar[:,1]
        v_bar[0,:] = 0
        v_bar[-1,:] = 0
        
        v_bar[0,0] = 0
        v_bar[0,-1] = 0
        v_bar[-1,0] = 0
        v_bar[-1,-1] = 0

    elif cond_type == "geometry_flow":
        u_init = init_vals[1]
        v_init = init_vals[0]

        u_bar[:,0] = u_init
        u_bar[:,-1] = u_init
        u_bar[0,:] = u_init
        u_bar[-1,:] = u_init
        u_bar[0,0] = u_init
        u_bar[0,-1] = u_init
        u_bar[-1,0] = u_init
        u_bar[-1,-1] = u_init

        v_bar[:,-1] = v_init
        v_bar[:,0] = v_init
        v_bar[0,:] = v_init
        v_bar[-1,:] = v_init
        v_bar[0,0] = v_init
        v_bar[0,-1] = v_init
        v_bar[-1,0] = v_init
        v_bar[-1,-1] = v_init

        for i in range(mesh.shape[0]):
            for j in range(mesh.shape[1]):
                if mesh[i,j] == 1:
                    u_bar[i,j] = 0
                    v_bar[i,j] = 0

    elif cond_type == "L_duct":
        u_init = init_vals[0]
        v_init = init_vals[1]
        n_x = len(u_bar[:,1])
        n_y = len(u_bar[1,:])
        
        x_open = int(np.floor(n_x/2))
        y_open = int(np.floor(n_y/2))

        u_bar[:,0] = 0
        u_bar[:y_open,-1] = u_bar[:y_open,-2]
        u_bar[-1,:x_open] = u_bar[-2,:x_open]
        u_bar[0,:] = 0
        
        u_bar[0,0] = 0
        u_bar[0,-1] = 0
        u_bar[-1,0] = 0
        u_bar[-1,-1] = 0

        v_bar[:y_open,-1] = v_bar[:y_open,-2]
        v_bar[:,0] = 0
        v_bar[0,:] = 0
        v_bar[-1,:x_open] = v_bar[-2, :x_open]
        
        v_bar[0,0] = 0
        v_bar[0,-1] = 0
        v_bar[-1,0] = 0
        v_bar[-1,-1] = 0
        
        u_bar[y_open:,x_open:] = 0
        v_bar[y_open:,x_open:] = 0
        
    return u_bar,v_bar