import sys
import json
import pandas as pd
import numpy as np 
import matplotlib.pyplot as plt
from mesh_generator import generate_mesh
from intermediate_velocity import calc_Ui
from final_velocity import calc_Uf
from solver_methods import solve_poisson
from boundary_conds import apply_BCs


# Process the solver parameters
def unpack_solver_params(solver_params):
    L_x = solver_params["length_x"]
    L_y = solver_params["length_y"] 
    n_x = solver_params["n_x"]
    n_y = solver_params["n_y"]
    nu = solver_params["nu"]
    rho = solver_params["rho"]
    iters = solver_params["iters"]
    dt = solver_params["dt"]
    EPS = solver_params["eps"]
    MAXITR = solver_params["maxitr"]
    input_solver = solver_params["input_solver"]
    return input_solver, L_x, L_y, n_x, n_y, nu, rho, iters, dt, EPS, MAXITR


# Process the geometry parameters
def unpack_geom_params(geom_params):
    scale = geom_params["scale"]
    mesh_type = geom_params["geometry"]
    center = geom_params["center"]
    return mesh_type, scale, center


# Process the initial parameters
def unpack_init_params(init_params):
    u_init = init_params["u_init"]
    v_init = init_params["v_init"]
    u_flow = init_params["u_flow"]
    v_flow = init_params["v_flow"]
    cond_type = init_params["cond_type"]
    return u_init, v_init, u_flow, v_flow, cond_type

# Plot the mesh geometry
def plot_mesh(mesh, center, L_x, L_y, n_x, n_y):
    x = np.linspace(0,L_x, n_x)
    y = np.linspace(0,L_y,n_y)
    X,Y = np.meshgrid(x,y) 
    fig, ax = plt.subplots()
    ax.imshow(mesh)
    plt.savefig('mesh_plot.png')

# Plot results
def plot_results(U, V, P, mesh, x_m, y_m, center, L_x, L_y, n_x, n_y, init_vals, cond_type):

    # Copy the U and V results
    U_val = np.zeros((U.shape[0] + 2, U.shape[1] + 2))
    V_val = np.zeros((V.shape[0] + 2, V.shape[1] + 2))
    U_val[1:-1, 1:-1] = np.copy(U)
    V_val[1:-1, 1:-1] = np.copy(V)

    # Apply the BCs
    U_val, V_val = apply_BCs(U_val, V_val, mesh, init_vals, cond_type)

    # Plot solutions
    x = np.linspace(0,L_x,n_x+2)
    y = np.linspace(0,L_y,n_y+2)
    x_np = np.linspace(0,L_x,n_x)
    y_np = np.linspace(0,L_y,n_y)
    X,Y = np.meshgrid(x,y) 
    X_np,Y_np = np.meshgrid(x_np,y_np)

    # Adjust geometry plotting
    X_m = x_m  + center[1] + L_x/2
    Y_m = y_m + center[0] + L_y/2

    # Plot velocities
    fig, ax = plt.subplots()
    plt.contourf(X,Y,U_val)
    plt.scatter(X_m, Y_m, s=1/90, c="k")
    plt.colorbar()
    plt.title("v-velocity contours")
    plt.savefig('V_sol.png')
    np.savetxt("V.dat", U_val, delimiter=",")

    fig, ax = plt.subplots()
    plt.contourf(X,Y,V_val)
    plt.scatter(X_m, Y_m, s=1/90, c="k")
    plt.colorbar() 
    plt.title("u-velocity contours")
    plt.savefig('U_sol.png')
    np.savetxt("U.dat", V_val, delimiter=",")

    # Plot Pressure
    fig, ax = plt.subplots()
    plt.contourf(X_np,Y_np,P)
    plt.scatter(X_m, Y_m, s=1/90, c="k")
    plt.colorbar() 
    plt.title("Pressure contours")
    plt.savefig('Pressure.png')


    # Plot streamlines
    numpts_x = n_x//16
    numpts_y = n_y//16
    fig, ax = plt.subplots()
    plt.scatter(X_m, Y_m, s=1/90, c="k")
    plt.streamplot(X[::numpts_x,::numpts_y],Y[::numpts_x,::numpts_y],V_val[::numpts_x,::numpts_y],U_val[::numpts_x,::numpts_y])
    plt.title("Streamlines")
    plt.savefig('streamlines.png')



# Execute NS Solver
def main():
    # Process input variables
    inputs = sys.argv[1]
    json_file = open(inputs)
    json_inputs = json.load(json_file)
    solver_params = json_inputs["solver_params"]
    geom_params = json_inputs["geometry_params"]
    init_params = json_inputs["init_conditions"]
    input_solver, L_x, L_y, n_x, n_y, nu, rho, iters, dt, EPS, MAXITR = unpack_solver_params(solver_params)
    mesh_type, scale, center = unpack_geom_params(geom_params)
    u_init, v_init, u_flow, v_flow, cond_type = unpack_init_params(init_params)
    init_vals = [u_init, v_init]


    # Calculate timesteps and step in X and Y
    dx = L_x/n_x
    dy = L_y/n_y

    
    # Generate and save mesh image
    mesh, x_m, y_m = generate_mesh(L_x, L_y, n_x, n_y, mesh_type, scale, center)
    plot_mesh(mesh, center, L_x, L_y, n_x, n_y)


    # Initialize velocities
    U = np.ones((n_x, n_y)) * v_flow
    V = np.ones((n_x, n_y)) * u_flow

    # Apply geometry to the mesh
    if (mesh_type != "none"):
        U, V = apply_BCs(U, V, mesh, init_vals, cond_type)

    # Run iterations of NS Solver algorithm
    for itr in range(0, iters):
        # Calculate the intermediate velocities
        U_star, V_star = calc_Ui(U, V, mesh, nu, dt, dx, dy, init_vals, cond_type)
        # Solve pressure poisson
        P = solve_poisson(input_solver, U_star, V_star, mesh, rho, dt, dx, dy, init_vals, cond_type, EPS, MAXITR)
        # Apply correction step to velocities
        U, V = calc_Uf(U_star, V_star, mesh, rho, P, dt, dx, init_vals, cond_type)
        # Update iteration count to user
        if (itr % (iters//10) == 0):
            print(f"Running iteration: {itr}")

    # Plot solutions
    plot_results(U, V, P, mesh, x_m, y_m, center, L_x, L_y, n_x, n_y, init_vals, cond_type)

    
if __name__ == ("__main__"):
    main()