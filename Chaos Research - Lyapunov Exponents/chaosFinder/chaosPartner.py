import sympy as sp
import numpy as np

def l_inc(x_i, r):
    df_dx = r - 2*r*x_i
    return np.log(abs(df_dx))

def run():
    x = sp.Symbol('x')
    lda = sp.Symbol('lda')
    f = sp.sin(lda*x*sp.cos(7*sp.Abs(lda**2*x**2)))
    print("TEST FUNCTION:")
    print(f)
    r1 = 0
    r2 = 9

    rmin = np.minimum(r1, r2)
    rmax = np.maximum(r1, r2)
    x0 = 0.1
    num = 100

    rmn = round(rmin*1000)
    rmx = round(rmax*1000)

    rct = 0; # rct is a counter for the number of r-values iterated
    x_loc = np.zeros(num)
    lyap = np.zeros(rmx - rmn)
    for r in range(rmn, rmx):

        x_loc[0] = x0; #set initial condition
        rdec = r/1000 # convert back to decimal r
        print(rdec)
        l_sum = 0
        for n in range(1, num):
            x_loc[n] = f.subs([(x, x_loc[n-1]),(lda, rdec)])
            if n > 20:
                l_sum = l_sum + l_inc(x_loc[n], rdec)
        lyap[rct] = l_sum/(num-20)
        print(lyap[rct])
        rct=rct+1



run()