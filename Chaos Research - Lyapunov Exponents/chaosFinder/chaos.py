import numpy as np
import sympy as sp




# roll function
#   roll c, lambdda, log(x), e^x, x^c, x^lambda, 
#   
class Chaos:
    def __init__(self, seed, file):
        self.counter = 0
        self.seed = seed
        np.random.seed(seed)
        self.hasLda = False
        self.f = False
        self.chaos = False
        self.err = False
        self.file = file
        self.iterations = 0

    def randTermGen(self, x, lda):

        n = (self.get_digit() + self.get_digit()*10) % 15
        if self.hasLda == False:
            n = 8

        # c = self.get_digit() + self.get_digit()/10 + self.get_digit()/100
        c = self.get_digit() + 1
        norp = self.get_digit() % 2
    
        mult = 1
        if norp:
            mult = -1

        c = c * mult

        if n == 0:
            y = c*x*mult

        if n == 1:
            y = sp.log(x)

        if n == 2: 
            y = sp.cos(x)

        if n == 3: 
            y = sp.sin(x)

        if n == 4: 
            y = sp.atan(x)

        if n == 5:
            y = sp.Abs(x)

        if n == 6:
            y = c**x*mult

        if n == 7: 
            y = x**c

        if n >= 8:
            y = lda*x
            self.hasLda = True

        return y*mult

    def get_digit(self):
        return np.random.randint(0,9)

    def recursiveCall(self, f1, x, lda):
        self.iterations = self.iterations + 1
        n = self.get_digit() % 5

        if self.iterations == 5:
            n = 4

        if n == 0:
            f = f1 + self.randTermGen(x, lda)
        if n == 1: 
            f = f1 * self.randTermGen(x, lda)
        if n == 2: 
            f = self.randTermGen(f1, lda)
        if n == 3:
            f2 = self.randTermGen(x, lda)
            f = f2.subs(x, f1)
        if n == 4: 
            if self.hasLda:
                return f1
            else:
                f = f1
        
        return self.recursiveCall(f, x, lda)

    def generate(self):
        x = sp.Symbol('x')
        lda = sp.Symbol('lda')

        self.f = self.recursiveCall(self.randTermGen(x, lda), x, lda)

    def run(self):
        x = sp.Symbol('x')
        lda = sp.Symbol('lda')
        # self.f = lda*x*(1-x)
        try:
            r1 = self.get_digit() + self.get_digit()/10 + self.get_digit()/100
            r2 = self.get_digit() + self.get_digit()/10 + self.get_digit()/100

            rmin = np.minimum(r1, r2)
            rmax = np.maximum(r1, r2)
            x0 = 0.1
            num = 100

            rmn = round(rmin*1000)
            rmx = rmn + 1

            rct = 0; # rct is a counter for the number of r-values iterated
            x_loc = np.zeros(num)
            lyap = np.zeros(rmx - rmn)
            for r in range(rmn, rmx):
                x_loc[0] = x0; #set initial condition
                rdec = r/1000 # convert back to decimal r
                l_sum = 0
                for n in range(1, num):
                    x_loc[n] = self.f.subs([(x, x_loc[n-1]),(lda, rdec)])
                    if n > 20:
                        l_sum = l_sum + self.l_inc(x_loc[n], rdec)
                lyap[rct] = l_sum/(num-20)
                if lyap[rct] > 0:
                    self.chaos = True
                rct=rct+1
        except:
            self.err = True

    def l_inc(self, x_i, r):
        df_dx = r - 2*r*x_i
        return np.log(abs(df_dx))
 
    def dispResult(self):
        if self.chaos:
            ("-------------")
            print("FOUND CHAOS!!!!!!!!!!!!!!!!!!!!")
            print("Hit Function: ")
            print(self.f)
            print("Hit Seed: ")
            print(self.seed)
            print("-------------")
        else:
            print("-------------")
            print("No hit on Function: ")
            print(self.f)
            print("Errored out:")
            print(self.err)
            print("Seed: ")
            print(self.seed)
            print("-------------")

file = open('choasResults.txt', 'a')
firstSeed = 3200
numRuns = 500
for seed in range(firstSeed, firstSeed + numRuns):
    cObj = Chaos(seed, file)
    cObj.generate()
    cObj.run()
    cObj.dispResult()
# seed = 1
# cObj = Chaos(seed)
# cObj.run()