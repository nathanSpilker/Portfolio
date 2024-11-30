import numpy as np
import pandas as pd
import matplotlib.pyplot as plt



def update_mesh(mesh, X, Y, dx, dy, origin):
    # Fill in geometry boundary 
    fill_pts = []
    for i in range(0, X.shape[0]):
        x_pt = int(np.round(X[i]/dx)) + origin[0]
        y_pt = int(np.round(Y[i]/dy)) + origin[1]
        if (x_pt >= mesh.shape[0] or y_pt >= mesh.shape[1]):
            raise Exception("Geometry is out of bounds")
        mesh[x_pt, y_pt] = 1

    # Fill inside of geometry boundary 
    for i in range(0, mesh.shape[0]):
        for j in range(0, mesh.shape[1]):
            if (mesh[i,j] == 1):
                fill_pts.append(j)
        if (len(fill_pts) >= 2):
            mesh[i,fill_pts[0]:fill_pts[-1]] = 1
        fill_pts = []
    
    return mesh


def cylinder(n_x, n_y, scale):
    # Initialize radius 
    r = 1 

    # Calculate x and y vals for cylinder
    x = np.linspace(-r,r,n_x * 200)
    y_top = np.sqrt((r**2 - x**2))
    y_bottom = -np.sqrt((r**2 - x**2))

    # Apply cylinder scaling
    X = scale * np.concatenate([x, x])
    Y = scale * np.concatenate([y_top, y_bottom])
    
    return [X,Y]


def airfoil(n_x, n_y, scale):
    # Initialize airfoil dataframe
    airfoil = pd.read_csv("airfoil.dat")
    airfoil = np.array(airfoil)
    airfoil_pts = np.zeros((airfoil.shape[0], 2))

    # Parse dat file
    for i in range(0, airfoil.shape[0]):
        for j in range(0, 2):
            st = airfoil[i][0]
            st = st.split("\t")
            airfoil_pts[i,0] = st[0] 
            airfoil_pts[i,1] = st[1]
    num_pts = int(airfoil_pts.shape[0]/2) 
    airfoil_pts_wb =  np.zeros((num_pts+2,2))
    airfoil_pts_wb[0] = [1,0]
    airfoil_pts_wb[1:-1] = airfoil_pts[1:num_pts+1]
    airfoil_pts_wb[-1] = [0,0]

    top_pts = []
    bottom_pts = []

    for i in range(1, num_pts+1):
        x1 = airfoil_pts_wb[i][0]
        x2 = airfoil_pts_wb[i-1][0]
        y1 = airfoil_pts_wb[i][1]
        y2 = airfoil_pts_wb[i-1][1]  
        top_pts.append([x1,y1])
        bottom_pts.append([x1,-y1])
        x_min = np.min((x1,x2))
        x_max = np.max((x1,x2))
        x_lin = np.linspace(x_min,x_max,200)
        y_lin = np.interp(x_lin, [x1,x2], [y1,y2])
        for j in range(0, x_lin.shape[0]):
            top_pts.append([x_lin[j],y_lin[j]])
            bottom_pts.append([x_lin[j],-y_lin[j]])

    # Add interpolated points to list
    pts = np.concatenate((top_pts, bottom_pts))
    X = np.zeros(len(top_pts) + len(bottom_pts))
    Y = np.zeros(len(top_pts) + len(bottom_pts))
    for i in range(0, X.shape[0]):
        Y[i] = scale * pts[i][0]
        X[i] = scale * pts[i][1]

    return [X,Y]


def generate_mesh(L_x, L_y, n_x, n_y, mesh_type, scale, center=[0,0]):
    # Initialize parameters
    dx = L_x/n_x
    dy = L_y/n_y
    mesh = np.zeros((n_x,n_y))

    if (mesh_type != "none"):
        origin_x = int(np.round(mesh.shape[0]/2)) + int(center[0]/dx)
        origin_y = int(np.round(mesh.shape[1]/2)) + int(center[1]/dy)
        mesh[origin_x, origin_y] = 1

    # Check geometry type
    if (mesh_type == "airfoil"):
        geometry = airfoil
    elif(mesh_type == "cylinder"):
        geometry = cylinder
    elif(mesh_type == "none"):
        X=0
        Y=0
        return mesh, Y, X
    
    # Generate mesh
    X,Y = geometry(n_x, n_y,scale)
    mesh = update_mesh(mesh, X, Y, dx, dy, [origin_x, origin_y])
    
    return mesh, Y, X
    
