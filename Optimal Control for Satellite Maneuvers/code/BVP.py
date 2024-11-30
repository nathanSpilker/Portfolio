import numpy as np
from filterpy.kalman import unscented_transform, MerweScaledSigmaPoints
import sympy as sp
from scipy.stats import norm
import matplotlib.pyplot as plt
import time
from Aijk import Aijk

def classical_to_equinotial(ecc, sma, inc, omega, Lomega, nu):
    x = np.empty(6)
    x[0] = sma*(1-ecc**2)
    x[1] = ecc*np.cos(omega + Lomega)
    x[2] = ecc*np.sin(omega + Lomega)
    x[3] = np.tan(inc/2)*np.cos(Lomega)
    x[4] = np.tan(inc/2)*np.sin(Lomega)
    x[5] = nu + omega + Lomega
    return x
    
gamma = 1

# constants
mu_body = 4.892e-9
T_max = 1e-6
Isp = 1300
g0 = 9.81e-3
m_dot_max = T_max/(g0*Isp)

# Initial guess
tf = 300
l0 = np.ones(7)*1e-3

# parameters
eps = 0.001
emax = 0.6
dt = 10

# initial conditions
ecc_0 = 0.0085
sma_0 = 2100
inc_0 = np.pi/2
omega_0 = np.pi/2
Lomega_0 = -np.pi/2
nu_0 = np.pi/2
x0 = classical_to_equinotial(ecc_0, sma_0, inc_0, omega_0, Lomega_0, nu_0)
m0 = 1000
Cov0 = np.identity(6)*1e-3
Pcol0 = Cov0.flatten()

# terminal conditions
ecc_f = 0.173
sma_f = 0.5
inc_f = np.pi/2
omega_f = np.pi/2
Lomega_f = -np.pi/2
nu_f = 0
xf = classical_to_equinotial(ecc_f, sma_f, inc_f, omega_f, Lomega_f, nu_f)

# dynamics
G = np.identity(6)*1e-3

def F_eval(x):
    p = x[0]
    f = x[1]
    g = x[2]
    h = x[3]
    k = x[4]
    L = x[5]
    q = 1+f*np.cos(L)+g*np.sin(L)
    s = np.sqrt(1 + h**2 + k**2)
    return np.sqrt(p/mu_body)*np.matrix([[0,2*p/q,0],[np.sin(L), ((q+1)*np.cos(L)+f)/q, -g*(h*np.sin(L)-k*np.cos(L))/q], [-np.cos(L), ((q+1)*np.sin(L)+g)/q, f*(h*np.sin(L)-k*np.cos(L))/q], \
                                [0,0,(s**2/(2*q))*np.cos(L)],[0,0,(s**2/(2*q))*np.sin(L)],[0,0,(h*np.sin(L)-k*np.cos(L))/q]])

def A0(x):
    p = x[0]
    f = x[1]
    g = x[2]
    h = x[3]
    k = x[4]
    L = x[5]
    return np.matrix([[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [-3*np.sqrt(mu_body*p)*(f*np.cos(L) + 1)**2/(2*p**3), 2*np.sqrt(mu_body*p)*(f*np.cos(L) + 1)*np.cos(L)/p**2, 0, 0, 0, -2*f*np.sqrt(mu_body*p)*(f*np.cos(L) + 1)*np.sin(L)/p**2]])

def p_dyn(P_col, u, x, gamma, at):
    P = np.reshape(P_col, (6,6))
    Pol_dot = np.zeros((6,6))
    for i in range(6):
        for j in range(6):
            for ki in range(3):
                Pol_dot[i,j] += gamma*at*(Aijk(P,x,i,j,ki)*u[ki] + Aijk(P,x,j,i,ki)*u[ki])
    a0 = A0(x)
    P0_dot = a0@P + P@a0.T + G@G.T
    return (Pol_dot + P0_dot).flatten()

# x = [p,f,g,h,k,L]
def f_dyn(x, u, gamma, at):
    f_r = np.zeros(6)
    p = x[0]
    f = x[1]
    g = x[2]
    h = x[3]
    k = x[4]
    L = x[5]
    q = 1+f*np.cos(L)+g*np.sin(L)
    s2 = 1 + h**2 + k**2

    factor = np.sqrt(p/mu_body)
    f_r[0] = gamma*at*factor*2*p/q*u[1]
    f_r[1] = gamma*at*factor*(np.sin(L)*u[0] + ((q+1)*np.cos(L)+f)*u[1]/q + -(g*(h*np.sin(L)-k*np.cos(L)))*u[2]/q)
    f_r[2] = gamma*at*factor*(-np.cos(L)*u[0] + ((q+1)*np.sin(L)+g)*u[1]/q + -(f*(h*np.sin(L)-k*np.cos(L)))*u[2]/q)
    f_r[3] = gamma*at*factor*(s2*np.cos(L)/(2*q))*u[2]
    f_r[4] = gamma*at*factor*(s2*np.sin(L)/(2*q))*u[2]
    f_r[5] = np.sqrt(p*mu_body)*(q/p)**2 + gamma*at*factor*(h*np.sin(L)-k*np.cos(L))*u[2]/q
    return f_r

def l_dyn(l, x, P_col, gamma, at, m):
    # Px = np.reshape(P_col, (6,6))
    lx = l[:-1]
    a0 = A0(x)
    dx = 1e-3

    # alpha_0 = alpha_s(x,Px,G)
    # beta_0 = np.zeros(3)
    # for i in range(3):
    #     beta_0[i] = beta_i_s(x,Px,i)
    # p0_0 = P0(lx, x)
    # mu_0 = mu_star(beta_0, p0_0, alpha_0, at)
    # ps_0 = Ps(lx,x,beta_0,mu_0)
    ps_0 = Ps(lx,x,0,0)
    acc_0 = acc(ps_0) 
    Fa_0 = F_eval(x)@acc_0
    
    Fa_jac = np.zeros((6,6))

    for j in range(6):
        x_1 = x
        x_1[j] += dx
        # alpha_1 = alpha_s(x_1,Px,G)
        # beta_1 = np.zeros(3)
        # for i in range(3):
        #     beta_1[i] = beta_i_s(x_1,Px,i)
        # p0_1 = P0(lx, x_1)
        # mu_1 = mu_star(beta_1, p0_1, alpha_1, at)
        # ps_1 = Ps(lx,x_1,beta_1,mu_1)
        ps_1 = Ps(lx,x_1,0,0)
        acc_1 = acc(ps_1) 
        Fa_1 = F_eval(x_1)@acc_1
        
        dFadx = (Fa_1 - Fa_0)/dx
        Fa_jac[:,j] = dFadx.reshape(6)
                

    # dPsidx = np.zeros(6)
    # for j in range(6):
    #     x_1 = x
    #     x_1[j] += dx
    #     alpha_1 = alpha_s(x_1,Px,G)
    #     beta_1 = np.zeros(3)
    #     for i in range(3):
    #         beta_1[i] = beta_i_s(x_1,Px,i)
    #     dPsidx[j] = (alpha_1 - alpha_0)/dx + (gamma*at*(beta_1 - beta_0)/dx)@acc_0

    # lx_dot = -(a0 + gamma*at*Fa_jac).T@lx - mu_0@(dPsidx.T)
    # lm_dot = gamma*(at/m)*(Fa_0.T)@lx - mu_0*(-gamma*at*(beta_0@acc_0)/m)
    lx_dot = -(a0 + gamma*at*Fa_jac).T@lx 
    lm_dot = gamma*(at/m)*(Fa_0.T)@lx 
    return np.concatenate((lx_dot, lm_dot[0,0]), axis = None)

def m_dyn(gamma):
    return -gamma*m_dot_max

# def alpha_s(x,Px):
#     h_bar, Ph = unscented(x,Px)
#     dxi_sum = 0
#     for i in range(6):
#         temp = Dxi(h_bar, Ph, x, Px, i)*f0.subs([(p,x[0]),(f,x[1]),(g,x[2]),(h,x[3]),(k,x[4]),(L,x[5])])
#         dxi_sum += temp
#     dpij_sum = 0
#     a0 = A0(x)
#     P0_dot = a0@Px + Px@a0.T + G@G.T
#     for i in range(6):
#         for j in range(6):
#             dpij_sum += P0_dot[i,j]*DijP(h_bar, Ph, x, Px, i, j)

#     return dxi_sum + dpij_sum

# def beta_i_s(x,Px,i):
#     h_bar, Ph = unscented(x,Px)
#     dxj_sum = 0
#     for j in range(6):
#         dxj_sum += Dxi(h_bar, Ph, x, Px, j)*F[j,i].subs([(p,x[0]),(f,x[1]),(g,x[2]),(h,x[3]),(k,x[4]),(L,x[5])])
    
#     dpjk_sum = 0
#     for j in range(6):
#         for k in range(6):
#             dpjk_sum += DijP(h_bar, Ph, x, Px, j, k)*(Aijk(Px,x,j,k,i) + Aijk(Px,x,k,j,i))
#     return dxj_sum + dpjk_sum

def unscented(x, Px):
    # create sigma points and weights
    points = MerweScaledSigmaPoints(n=6, alpha=0.75, beta=2., kappa=0)
    sigmas = points.sigma_points(x, Px)

    ### pass through nonlinear function
    sigmas_f = np.empty((13, 6))
    for i in range(13):
        sigmas_f[i,:] = h_c(sigmas[i,:])
    h_bar, Ph = unscented_transform(sigmas_f, points.Wm, points.Wc)
    return [h_bar, Ph]

def h_c(x):
    return np.sqrt(x[1]**2+x[2]**2)-emax

def P0(lx,x):
    return -F.T.subs([(p,x[0]),(f,x[1]),(g,x[2]),(h,x[3]),(k,x[4]),(L,x[5])])@lx

def Ps(lx, x, beta, mu):
    return -((F_eval(x).T)@lx + mu*beta).T

def acc(ps):
    return ps/np.linalg.norm(ps)

def mu_star(beta, po, alpha, at):
    # return (beta.T@po/np.linalg.norm(beta))+(alpha/np.linalg.norm(beta))*\
    #     np.sqrt(((np.linalg.norm(beta)*np.linalg.norm(po))**2 - (beta.T@po)**2)/((at*np.linalg.norm(beta))**2 - alpha**2))
    return 0

def Dxi(h_bar, Ph, x, Px, i):
    dx = 1e-3
    x[i]+= dx
    h_bar_1, Ph_1 = unscented(x, Px)
    return ((h_bar_1-h_bar)/dx) + (norm.ppf(1-eps)*((Ph_1-Ph)/dx))/(2*np.sqrt(Ph))

def DijP(h_bar, Ph, x, Px, i, j):
    dPx = 1e-3
    Px[i,j]+= dPx
    h_bar_1, Ph_1 = unscented(x, Px)
    return ((h_bar_1-h_bar)/dPx) + (norm.ppf(1-eps)*((Ph_1-Ph)/dPx))/(2*np.sqrt(Ph))

def u_calc(x, l, P_col, at):
    # Px = np.reshape(P_col, (6,6))
    lx = l[:-1]
    # alpha_0 = alpha_s(x,Px)
    # beta_0 = np.zeros(3)
    # for i in range(3):
    #     beta_0[i] = beta_i_s(x,Px,i)
    # p0_0 = P0(lx, x)
    # mu_0 = mu_star(beta_0, p0_0, alpha_0, at)
    #ps_0 = Ps(lx,x,beta_0,mu_0)
    ps_0 = Ps(lx,x,0,0)
    acc_0 = acc(ps_0) 
    return acc_0

def a_t(m):
    return T_max / m

def rk4_step(x, Pcol, l, m, gamma, dt):

    k1_x = f_dyn(x, u_calc(x,l,Pcol,a_t(m)), gamma, a_t(m))
    k1_p = p_dyn(Pcol, u_calc(x,l,Pcol,a_t(m)), x, gamma, a_t(m))
    k1_l = l_dyn(l, x, Pcol, gamma, a_t(m), m)
    k1_m = m_dyn(gamma)
    
    x2 = x + k1_x*dt/2
    Pcol2 = Pcol + k1_p*dt/2 
    l2 = l + k1_l*dt/2
    m2 = m + k1_m*dt/2

    k2_x = f_dyn(x2, u_calc(x2,l2,Pcol2,a_t(m2)), gamma, a_t(m2))
    k2_p = p_dyn(Pcol2, u_calc(x2,l2,Pcol2,a_t(m2)), x2, gamma, a_t(m2))
    k2_l = l_dyn(l2, x2, Pcol2, gamma, a_t(m2), m)
    k2_m = m_dyn(gamma)

    x3 = x + k2_x*dt/2
    Pcol3 = Pcol + k2_p*dt/2
    l3 = l + k2_l*dt/2
    m3 = m + k2_m*dt/2

    k3_x = f_dyn(x3, u_calc(x3,l3,Pcol3,a_t(m3)), gamma, a_t(m3))
    k3_p = p_dyn(Pcol3, u_calc(x3,l3,Pcol3,a_t(m3)), x3, gamma, a_t(m3))
    k3_l = l_dyn(l3, x3, Pcol3, gamma, a_t(m3), m)
    k3_m = m_dyn(gamma)

    x4 = x + k3_x*dt
    Pcol4 = Pcol + k3_p*dt
    l4 = l + k3_l*dt
    m4 = m + k3_m*dt

    k4_x = f_dyn(x4, u_calc(x4,l4,Pcol4,a_t(m4)), gamma, a_t(m4))
    k4_p = p_dyn(Pcol4, u_calc(x4,l4,Pcol4,a_t(m4)), x4, gamma, a_t(m4))
    k4_l = l_dyn(l4, x4, Pcol4, gamma, a_t(m4), m)
    k4_m = m_dyn(gamma)

    x_next = (k1_x + 2*k2_x + 2*k3_x + k4_x)*dt/6 + x
    P_next = (k1_p + 2*k2_p + 2*k3_p + k4_p)*dt/6 + Pcol
    l_next = (k1_l + 2*k2_l + 2*k3_l + k4_l)*dt/6 + l
    m_next = (k1_m + 2*k2_m + 2*k3_m + k4_m)*dt/6 + m

    return x_next, P_next, l_next, m_next

def integrate_system(x0, Pcol0, l0, m0, gamma, tf, dt):
    T_steps = int(tf/dt)
    T = np.linspace(0, tf, T_steps)
    x = np.empty((T_steps,6))
    l = np.empty((T_steps,7))
    m = np.empty(T_steps)
    Pcol = np.empty((T_steps, 36))
    x[0,:] = x0
    l[0,:] = l0
    m[0] = m0
    Pcol[0,:] = Pcol0 

    for i in range(T_steps - 1):
        x[i+1,:], Pcol[i+1,:], l[i+1,:], m[i+1] = rk4_step(x[i,:], Pcol[i,:], l[i,:], m[i], gamma, dt)
        print(i)
    return x, Pcol, l, m, T

def newton_raphson(Vi, Vf):
    return

def indirect_solver(x0, Vi, Vf, nu0, nuf, P0, G, dt):
    # integrate equations from initial guess
    return

x, Pcol, l, m, T = integrate_system(x0, Pcol0, l0, m0, gamma, tf, dt)
plt.plot(T, x)
plt.show()

# start = time.time()
# F_e = F_eval(x0).T@l0[:-1]
# F_e2 = F_e.T
# print(np.delete(F_e2, 1, 1))
# end = time.time()
# print(end-start)
# F_e2 = np.array(F.subs([(p,x0[0]),(f,x0[1]),(g,x0[2]),(h,x0[3]),(k,x0[4]),(L,x0[5])])).astype(np.float64)
# end2 = time.time()
# print(end2 - end)
# print(F_e2 - F_e)