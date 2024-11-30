import numpy as np
from filterpy.kalman import unscented_transform, MerweScaledSigmaPoints
import sympy as sp
from scipy.stats import norm
import matplotlib.pyplot as plt
import time
from Aijk import Fjkl_calc

def classical_to_equinotial(ecc, sma, inc, omega, Lomega, nu):
    x = np.empty(6)
    x[0] = sma*(1-ecc**2)
    x[1] = ecc*np.cos(omega + Lomega)
    x[2] = ecc*np.sin(omega + Lomega)
    x[3] = np.tan(inc/2)*np.cos(Lomega)
    x[4] = np.tan(inc/2)*np.sin(Lomega)
    x[5] = nu + omega + Lomega
    return x
    
def classical_to_cartesian(x, mu_body):
    ecc = x[0]
    sma = x[1]
    inc = x[2]
    omega = x[3]
    Lomega = x[4]
    nu = x[5]

    x_vect = np.empty(6)

    E_rcs = np.arctan((np.sqrt(1-ecc**2)*np.sin(nu))/(1+ecc*np.cos(nu)))
    r = sma*(1-ecc*np.cos(E_rcs))
    o_u = -np.sqrt(mu_body*sma)*np.sin(E_rcs)/r
    o_v = np.sqrt(mu_body*sma)*np.sqrt(1-ecc**2)*np.cos(E_rcs)
    o_x = r*np.cos(nu)
    o_y = r*np.sin(nu)

    x_vect[0] = o_x*(np.cos(omega)*np.cos(Lomega)-np.sin(omega)*np.cos(inc)*np.sin(Lomega))-\
                o_y*(np.sin(omega)*np.cos(Lomega) + np.cos(omega)*np.cos(inc)*np.sin(Lomega))
    x_vect[1] = o_x*(np.cos(omega)*np.sin(Lomega)+np.sin(omega)*np.cos(inc)*np.cos(Lomega))+\
                o_y*(np.cos(omega)*np.cos(inc)*np.cos(Lomega) - np.sin(omega)*np.sin(Lomega))
    x_vect[2] = o_x*(np.sin(omega)*np.sin(inc)) + o_y*(np.cos(omega)*np.sin(inc))
    x_vect[3] = o_u*(np.cos(omega)*np.cos(Lomega)-np.sin(omega)*np.cos(inc)*np.sin(Lomega))-\
                o_v*(np.sin(omega)*np.cos(Lomega) + np.cos(omega)*np.cos(inc)*np.sin(Lomega))
    x_vect[4] = o_u*(np.cos(omega)*np.sin(Lomega)+np.sin(omega)*np.cos(inc)*np.cos(Lomega))+\
                o_v*(np.cos(omega)*np.cos(inc)*np.cos(Lomega) - np.sin(omega)*np.sin(Lomega))
    x_vect[5] = o_u*(np.sin(omega)*np.sin(inc)) + o_v*(np.cos(omega)*np.sin(inc))
    return x_vect
    
def equinotial_to_classical(x):
    p = x[0]
    f = x[1]
    g = x[2]
    h = x[3]
    k = x[4]
    L = x[5]
    x_vect = np.empty(6)

    x_vect[0] = np.sqrt(f**2 + g**2)
    x_vect[1] = p/(1-f**2-g**2)
    x_vect[2] = 2*np.arctan(np.sqrt(h**2 + k**2))
    x_vect[3] = np.arctan(g/f)-np.arctan(k/h)
    x_vect[4] = np.arctan2(k,h)
    x_vect[5] = L-np.arctan(g/f)

    return x_vect

def equinotial_to_cartesian(x):
    p = x[0]
    f = x[1]
    g = x[2]
    h = x[3]
    k = x[4]
    L = x[5]
    x_vect = np.empty(6)

    alpha2 = h**2 -k**2
    s2 = 1+h**2+k**2
    w = 1+f*np.cos(L)+g*np.sin(L)
    r = p/w

    x_vect[0] = (r/s2)*(np.cos(L)+alpha2*np.cos(L)+2*h*k*np.sin(L))
    x_vect[1] = (r/s2)*(np.sin(L)+alpha2*np.sin(L)+2*h*k*np.cos(L))
    x_vect[2] = (2*r/s2)*(h*np.sin(L)-k*np.cos(L))
    x_vect[3] = 0
    x_vect[4] = 0
    x_vect[5] = 0

    return x_vect

gamma = 1

# constants
mu_body = 3.986e5
T_max = 1e-2
Isp = 1300.
g0 = 9.81e-3
m_dot_max = T_max/(g0*Isp)

# Initial guess
tf_0 = 1000.
l0 = np.ones(7)*10

# parameters
eps = 0.001
emax = 0.6
d_l_itr = 1000
d_t_itr = 10

# initial conditions
ecc_0 = 0.0085
sma_0 = 42000.
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
sma_f = 41000.
inc_f = np.pi/2
omega_f = np.pi/2
Lomega_f = -np.pi/2
nu_f = 0
psi_f = np.array([[1,0,0,0,0,0],[0,1,0,0,0,0],[0,0,1,0,0,0],[0,0,0,1,0,0],[0,0,0,0,1,0]])
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
    return np.sqrt(p/mu_body)*np.array([[0,2*p/q,0],[np.sin(L), ((q+1)*np.cos(L)+f)/q, -g*(h*np.sin(L)-k*np.cos(L))/q], [-np.cos(L), ((q+1)*np.sin(L)+g)/q, f*(h*np.sin(L)-k*np.cos(L))/q], \
                                [0,0,(s**2/(2*q))*np.cos(L)],[0,0,(s**2/(2*q))*np.sin(L)],[0,0,(h*np.sin(L)-k*np.cos(L))/q]])

def A0(x):
    p = x[0]
    f = x[1]
    g = x[2]
    h = x[3]
    k = x[4]
    L = x[5]
    return np.array([[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [-3*np.sqrt(mu_body*p)*(f*np.cos(L) + 1)**2/(2*p**3), 2*np.sqrt(mu_body*p)*(f*np.cos(L) + 1)*np.cos(L)/p**2, 0, 0, 0, -2*f*np.sqrt(mu_body*p)*(f*np.cos(L) + 1)*np.sin(L)/p**2]])

def p_dyn(P_col, u, x, gamma, at):
    P = np.reshape(P_col, (6,6))
    Fjkl = Fjkl_calc(mu_body, x)
    Pol_dot = np.zeros((6,6))
    for i in range(6):
        for j in range(6):
            for k in range(3):
                Pol_dot[i,j] += gamma*at*(np.sum(P[i,:]*Fjkl[j,k,:])*u[k] + np.sum(P[j,:]*Fjkl[i,k,:])*u[k])
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
    lx = l[:-1]
    a0 = A0(x)
    dx = 1e-3
    ps_0 = Ps(lx,x)
    acc_0 = acc(ps_0) 
    Fa_0 = F_eval(x)@acc_0
    Fa_jac = np.zeros((6,6))
    for j in range(6):
        x_1 = np.copy(x)
        x_1[j] += dx
        # ps_1 = Ps(lx,x_1)
        # acc_1 = acc(ps_1) 
        Fa_1 = F_eval(x_1)@acc_0
        
        dFadx = (Fa_1 - Fa_0)/dx
        Fa_jac[:,j] = dFadx.reshape(6)
                
    lx_dot = -(a0 + gamma*at*Fa_jac).T@lx
    lm_dot = gamma*(at/m)*(Fa_0.T)@lx 
    l_return = np.zeros(7)
    l_return[:-1] = lx_dot
    l_return[-1] = lm_dot
    return l_return

def m_dyn(gamma):
    return -gamma*m_dot_max

def P0(lx,x):
    return -F_eval(x).T@lx

def Ps(lx, x):
    return -((F_eval(x).T)@lx).T

def acc(ps):
    return ps/np.linalg.norm(ps)

def u_calc(x, l, P_col, at):
    lx = l[:-1]

    ps_0 = Ps(lx,x)
    acc_0 = acc(ps_0) 
    return acc_0

def a_t(m):
    return T_max / m

def calc_Hs(x, l, m, gamma):
    lx = l[:-1]
    lm = l[-1]
    ps = Ps(lx,x)
    accel = acc(ps) 
    Hs = 1 + lx.T@f_dyn(x, accel, gamma, a_t(m))-lm*gamma*m_dot_max
    return Hs

def rk4_step(x, Pcol, l, m, gamma, dt):
    x_1 = np.copy(x)
    Pcol_1 = np.copy(Pcol)
    l_1 = np.copy(l)
    m_1 = np.copy(m)

    k1_x = f_dyn(x_1, u_calc(x_1,l_1,Pcol_1,a_t(m_1)), gamma, a_t(m_1))
    k1_p = p_dyn(Pcol_1, u_calc(x,l,Pcol,a_t(m_1)), x_1, gamma, a_t(m_1))
    k1_l = l_dyn(l_1, x_1, Pcol_1, gamma, a_t(m_1), m_1)
    k1_m = m_dyn(gamma)

    x2 = x + k1_x*dt/2
    Pcol2 = Pcol + k1_p*dt/2 
    l2 = l + k1_l*dt/2
    m2 = m + k1_m*dt/2

    k2_x = f_dyn(x2, u_calc(x2,l2,Pcol2,a_t(m2)), gamma, a_t(m2))
    k2_p = p_dyn(Pcol2, u_calc(x2,l2,Pcol2,a_t(m2)), x2, gamma, a_t(m2))
    k2_l = l_dyn(l2, x2, Pcol2, gamma, a_t(m2), m2)
    k2_m = m_dyn(gamma)

    x3 = x + k2_x*dt/2
    Pcol3 = Pcol + k2_p*dt/2
    l3 = l + k2_l*dt/2
    m3 = m + k2_m*dt/2

    k3_x = f_dyn(x3, u_calc(x3,l3,Pcol3,a_t(m3)), gamma, a_t(m3))
    k3_p = p_dyn(Pcol3, u_calc(x3,l3,Pcol3,a_t(m3)), x3, gamma, a_t(m3))
    k3_l = l_dyn(l3, x3, Pcol3, gamma, a_t(m3), m3)
    k3_m = m_dyn(gamma)

    x4 = x + k3_x*dt
    Pcol4 = Pcol + k3_p*dt
    l4 = l + k3_l*dt
    m4 = m + k3_m*dt
    
    k4_x = f_dyn(x4, u_calc(x4,l4,Pcol4,a_t(m4)), gamma, a_t(m4))
    k4_p = p_dyn(Pcol4, u_calc(x4,l4,Pcol4,a_t(m4)), x4, gamma, a_t(m4))
    k4_l = l_dyn(l4, x4, Pcol4, gamma, a_t(m4), m4)
    k4_m = m_dyn(gamma)

    x_next = (k1_x + 2*k2_x + 2*k3_x + k4_x)*dt/6 + x
    P_next = (k1_p + 2*k2_p + 2*k3_p + k4_p)*dt/6 + Pcol
    l_next = (k1_l + 2*k2_l + 2*k3_l + k4_l)*dt/6 + l
    m_next = (k1_m + 2*k2_m + 2*k3_m + k4_m)*dt/6 + m
    return x_next, P_next, l_next, m_next

def integrate_system(x0, Pcol0, l0, m0, gamma, tf):
    T_steps = 500
    dt = tf/T_steps
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
    Hs = calc_Hs(x[-1,:], l[-1,:], m[-1], gamma)
    return x, Pcol, l, m, Hs


def indirect_solver(x0, Pcol0, l0, m0, psi_f, xf, tf0, gamma, d_l_itr, d_t_itr, max_itrs, max_err):
    # integrate equations starting from initial guess
    l_01 = np.copy(l0)
    x_01 = np.copy(x0)
    Pcol_01 = np.copy(Pcol0)
    m_01 = np.copy(m0)
    tf_01 = np.copy(tf0)
    for itr in range(max_itrs):
        x_c, Pcol_c, l_c, m_c, Hs_c = integrate_system(x_01, Pcol_01, l_01, m_01, gamma, tf_01)
        F_c = np.concatenate([psi_f@(x_c[-1,:]-xf), l_c[-1,5:7], np.array([Hs_c])])
        err = np.sum(np.abs(F_c))
        if err < max_err:
            return l_01, tf_01
        print("Iteration: " + str(itr) + "   sum of error: " + str(err))
        J = np.zeros((8,8))
        for j in range(8):
            if j < 7:
                l0_new = np.copy(l_01)
                l0_new[j] += d_l_itr
                x_n, Pcol_n, l_n, m_n, Hs_n = integrate_system(x_01, Pcol_01, l0_new, m_01, gamma, tf_01)
                F_n = np.concatenate([psi_f@(x_n[-1,:]-xf), l_n[-1,5:7], np.array([Hs_n])])
                for i in range(8):
                    J[i,j] = (F_n[i]-F_c[i])/d_l_itr
            else:
                tf_new = tf_01 + d_t_itr
                x_n, Pcol_n, l_n, m_n, Hs_n = integrate_system(x_01, Pcol_01, l_01, m_01, gamma, tf_new)
                F_n = np.concatenate([psi_f@(x_n[-1,:]-xf), l_n[-1,5:7], np.array([Hs_n])])
                for i in range(8):
                    J[i,j] = (F_n[i]-F_c[i])/d_t_itr
        print(J)
        break
        J_inv = np.linalg.inv(J)
        delta_v = J_inv@(-F_c)
        l_01 += delta_v[:-1]
        tf_01 += delta_v[-1]
        print(delta_v)

indirect_solver(x0, Pcol0, l0, m0, psi_f, xf, tf_0, gamma, d_l_itr, d_t_itr, 20, 1e-2)