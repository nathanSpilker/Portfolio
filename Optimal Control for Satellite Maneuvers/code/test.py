import numpy as np
from filterpy.kalman import unscented_transform
import sympy as sp


# p,f,g,h,k,L,mu = sp.symbols('p,f,g,h,k,L,mu', real=True)
# symbs = [p,f,g,h,k,L]
# q = 1 + f*sp.cos(L)
# s = sp.sqrt(1 + h**2 + k**2)
# f0 = sp.Matrix([0,0,0,0,0,sp.sqrt(p*mu)*(q/p)**2])
# jacobian = f0.jacobian([p,f,g,h,k,L])
# print(jacobian)

# x = np.empty(6)
# ecc = 0.7
# f = lambda E: E - ecc*np.sin(E)
# f_prime = lambda E: 1 - ecc*np.cos(E)
# nu = np.pi/2
# def my_newton(f, df, x0, tol):
# # output is an estimation of the root of f 
# # using the Newton Raphson method
# # recursive implementation
#     if abs(f(x0)) < tol:
#         return x0
#     else:
#         return my_newton(f, df, x0 - f(x0)/df(x0), tol)

# E_rcs = np.arctan((np.sqrt(1-ecc**2)*np.sin(nu))/(1+ecc*np.cos(nu)))
# print(E_rcs)
psi_f = np.array([[1,0,0,0,0,0],[0,1,0,0,0,0],[0,0,1,0,0,0],[0,0,0,1,0,0],[0,0,0,0,1,0]])
print(psi_f)
