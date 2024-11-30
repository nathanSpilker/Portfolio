import sympy as sp

p,f,g,h,k,L,mu_body = sp.symbols('p,f,g,h,k,L,mu', real=True)
q = 1 + f*sp.cos(L)
s = sp.sqrt(1 + h**2 + k**2)
F = sp.sqrt(p/mu_body)*sp.Matrix([[0,2*p/q,0],[sp.sin(L), ((q+1)*sp.cos(L)+f)/q, -g*(h*sp.sin(L)-k*sp.cos(L))/q], [-sp.cos(L), ((q+1)*sp.sin(L)+g)/q, f*(h*sp.sin(L)-k*sp.cos(L))/q], \
                                [0,0,(s**2/(2*q))*sp.cos(L)],[0,0,(s**2/(2*q))*sp.sin(L)],[0,0,(h*sp.sin(L)-k*sp.cos(L))/q]])
f0 = sp.Matrix([0,0,0,0,0,sp.sqrt(p*mu_body)*(q/p)**2])
symbs = [p,f,g,h,k,L]

j = 0
ki = 1
l =0
print(sp.diff(F[j,ki], symbs[l]))