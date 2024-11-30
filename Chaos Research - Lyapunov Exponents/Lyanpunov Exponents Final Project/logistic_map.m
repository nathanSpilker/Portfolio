x = linspace(0,1,100);
lambda = 3.9;
f = lambda*(lambda*(lambda*x.*(1-x)).*(1-(lambda*x.*(1-x)))).*(1-(lambda*(lambda*x.*(1-x)).*(1-(lambda*x.*(1-x)))));

figure
plot(x,f)
hold
plot(x,x)
xlabel("x_n")
ylabel("f(f(f(x_n)))")
title("f(f(f(x_n))) vs. x_{n} for \lambda = 3.9")

