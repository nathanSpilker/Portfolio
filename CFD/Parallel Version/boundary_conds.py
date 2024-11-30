import numpy as np

def apply_BCs(u, v, init_vals, cond_type): 
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
    elif cond_type == "flow_into_cup": 
        u_init = -init_vals[0]
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
    elif cond_type == "duct": 
        u_init = init_vals[0]
        u_bar[:,0] = u_init
        u_bar[:,-1] = u_init
        u_bar[0,:] = 0
        u_bar[-1,:] = 0
        u_bar[0,0] = 0
        u_bar[0,-1] = 0
        u_bar[-1,0] = 0
        u_bar[-1,-1] = 0

        v_bar[:,-1] = 0
        v_bar[:,0] = 0
        v_bar[0,:] = 0
        v_bar[-1,:] = 0
        v_bar[0,0] = 0
        v_bar[0,-1] = 0
        v_bar[-1,0] = 0
        v_bar[-1,-1] = 0
    elif cond_type == "corner_flow": 
        u_init = init_vals[0]
        u_bar[:,0] = 0
        u_bar[:,-1] = -u_init
        u_bar[0,:] = 0
        u_bar[-1,:] = 0
        u_bar[0,0] = 0
        u_bar[0,-1] = 0
        u_bar[-1,0] = 0
        u_bar[-1,-1] = 0

        v_bar[:,-1] = 0
        v_bar[:,0] = 0
        v_bar[0,:] = 0
        v_bar[-1,:] = -u_init
        v_bar[0,0] = 0
        v_bar[0,-1] = 0
        v_bar[-1,0] = 0
        v_bar[-1,-1] = 0
        
    return u_bar,v_bar