import numpy as np


def Fjkl_calc(mu,x):
    ar = np.zeros((6,3,6))
    p = x[0]
    f = x[1]
    g = x[2]
    h = x[3]
    k = x[4]
    L = x[5]
    
    ar[0,1,0] = 3*np.sqrt(p/mu)/(f*np.cos(L) + 1)
    ar[0,1,1] = -2*p*np.sqrt(p/mu)*np.cos(L)/(f*np.cos(L) + 1)**2
    ar[0,1,5] = 2*f*p*np.sqrt(p/mu)*np.sin(L)/(f*np.cos(L) + 1)**2
    ar[1,0,0] = np.sqrt(p/mu)*np.sin(L)/(2*p)
    ar[1,0,5] = np.sqrt(p/mu)*np.cos(L)
    ar[1,1,0] = np.sqrt(p/mu)*(f + (f*np.cos(L) + 2)*np.cos(L))/(2*p*(f*np.cos(L) + 1))
    ar[1,1,1] = -np.sqrt(p/mu)*(f + (f*np.cos(L) + 2)*np.cos(L))*np.cos(L)/(f*np.cos(L) + 1)**2 + np.sqrt(p/mu)*(np.cos(L)**2 + 1)/(f*np.cos(L) + 1)
    ar[1,1,5] = f*np.sqrt(p/mu)*(f + (f*np.cos(L) + 2)*np.cos(L))*np.sin(L)/(f*np.cos(L) + 1)**2 + np.sqrt(p/mu)*(-f*np.sin(L)*np.cos(L) - (f*np.cos(L) + 2)*np.sin(L))/(f*np.cos(L) + 1)
    ar[1,2,0] = -g*np.sqrt(p/mu)*(h*np.sin(L) - k*np.cos(L))/(2*p*(f*np.cos(L) + 1))
    ar[1,2,1] = g*np.sqrt(p/mu)*(h*np.sin(L) - k*np.cos(L))*np.cos(L)/(f*np.cos(L) + 1)**2
    ar[1,2,2] = -np.sqrt(p/mu)*(h*np.sin(L) - k*np.cos(L))/(f*np.cos(L) + 1)
    ar[1,2,3] = -g*np.sqrt(p/mu)*np.sin(L)/(f*np.cos(L) + 1)
    ar[1,2,4] = g*np.sqrt(p/mu)*np.cos(L)/(f*np.cos(L) + 1)
    ar[1,2,5] = -f*g*np.sqrt(p/mu)*(h*np.sin(L) - k*np.cos(L))*np.sin(L)/(f*np.cos(L) + 1)**2 - g*np.sqrt(p/mu)*(h*np.cos(L) + k*np.sin(L))/(f*np.cos(L) + 1)
    ar[2,0,0] = -np.sqrt(p/mu)*np.cos(L)/(2*p)
    ar[2,0,5] = np.sqrt(p/mu)*np.sin(L)
    ar[2,1,0] = np.sqrt(p/mu)*(g + (f*np.cos(L) + 2)*np.sin(L))/(2*p*(f*np.cos(L) + 1))
    ar[2,1,1] = -np.sqrt(p/mu)*(g + (f*np.cos(L) + 2)*np.sin(L))*np.cos(L)/(f*np.cos(L) + 1)**2 + np.sqrt(p/mu)*np.sin(L)*np.cos(L)/(f*np.cos(L) + 1)
    ar[2,1,2] = np.sqrt(p/mu)/(f*np.cos(L) + 1)
    ar[2,1,5] = f*np.sqrt(p/mu)*(g + (f*np.cos(L) + 2)*np.sin(L))*np.sin(L)/(f*np.cos(L) + 1)**2 + np.sqrt(p/mu)*(-f*np.sin(L)**2 + (f*np.cos(L) + 2)*np.cos(L))/(f*np.cos(L) + 1)
    ar[2,2,0] = f*np.sqrt(p/mu)*(h*np.sin(L) - k*np.cos(L))/(2*p*(f*np.cos(L) + 1))
    ar[2,2,1] = -f*np.sqrt(p/mu)*(h*np.sin(L) - k*np.cos(L))*np.cos(L)/(f*np.cos(L) + 1)**2 + np.sqrt(p/mu)*(h*np.sin(L) - k*np.cos(L))/(f*np.cos(L) + 1)
    ar[2,2,3] = f*np.sqrt(p/mu)*np.sin(L)/(f*np.cos(L) + 1)
    ar[2,2,4] = -f*np.sqrt(p/mu)*np.cos(L)/(f*np.cos(L) + 1)
    ar[2,2,5] = f**2*np.sqrt(p/mu)*(h*np.sin(L) - k*np.cos(L))*np.sin(L)/(f*np.cos(L) + 1)**2 + f*np.sqrt(p/mu)*(h*np.cos(L) + k*np.sin(L))/(f*np.cos(L) + 1)
    ar[3,2,0] = np.sqrt(p/mu)*(h**2 + k**2 + 1)*np.cos(L)/(2*p*(2*f*np.cos(L) + 2))
    ar[3,2,1] = -2*np.sqrt(p/mu)*(h**2 + k**2 + 1)*np.cos(L)**2/(2*f*np.cos(L) + 2)**2
    ar[3,2,3] = 2*h*np.sqrt(p/mu)*np.cos(L)/(2*f*np.cos(L) + 2)
    ar[3,2,4] = 2*k*np.sqrt(p/mu)*np.cos(L)/(2*f*np.cos(L) + 2)
    ar[3,2,5] = 2*f*np.sqrt(p/mu)*(h**2 + k**2 + 1)*np.sin(L)*np.cos(L)/(2*f*np.cos(L) + 2)**2 - np.sqrt(p/mu)*(h**2 + k**2 + 1)*np.sin(L)/(2*f*np.cos(L) + 2)
    ar[4,2,0] = np.sqrt(p/mu)*(h**2 + k**2 + 1)*np.sin(L)/(2*p*(2*f*np.cos(L) + 2))
    ar[4,2,1] = -2*np.sqrt(p/mu)*(h**2 + k**2 + 1)*np.sin(L)*np.cos(L)/(2*f*np.cos(L) + 2)**2
    ar[4,2,3] = 2*h*np.sqrt(p/mu)*np.sin(L)/(2*f*np.cos(L) + 2)
    ar[4,2,4] = 2*k*np.sqrt(p/mu)*np.sin(L)/(2*f*np.cos(L) + 2)
    ar[4,2,5] = 2*f*np.sqrt(p/mu)*(h**2 + k**2 + 1)*np.sin(L)**2/(2*f*np.cos(L) + 2)**2 + np.sqrt(p/mu)*(h**2 + k**2 + 1)*np.cos(L)/(2*f*np.cos(L) + 2)
    ar[5,2,0] = np.sqrt(p/mu)*(h*np.sin(L) - k*np.cos(L))/(2*p*(f*np.cos(L) + 1))
    ar[5,2,1] = -np.sqrt(p/mu)*(h*np.sin(L) - k*np.cos(L))*np.cos(L)/(f*np.cos(L) + 1)**2
    ar[5,2,3] = np.sqrt(p/mu)*np.sin(L)/(f*np.cos(L) + 1)
    ar[5,2,4] = -np.sqrt(p/mu)*np.cos(L)/(f*np.cos(L) + 1)
    ar[5,2,5] = f*np.sqrt(p/mu)*(h*np.sin(L) - k*np.cos(L))*np.sin(L)/(f*np.cos(L) + 1)**2 + np.sqrt(p/mu)*(h*np.cos(L) + k*np.sin(L))/(f*np.cos(L) + 1)
    
    return ar