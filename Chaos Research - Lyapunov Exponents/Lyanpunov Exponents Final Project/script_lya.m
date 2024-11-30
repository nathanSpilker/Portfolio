clear
rmin = -1;
rmax = 1;
x0 = 0.1;
num = 1000;

a = 6.5;

rmn = round(rmin*1000); 
rmx = round(rmax*1000);
rct = 1; %rct is a counter for the number of r-values interated
for r = rmn:rmx
    x(1)=x0; %set initial condition
        rdec = r/1000; % convert back to decimal r
        l_sum = 0;
    for n=2:num
        x(n)=exp(-a*x(n-1)^2)+rdec;
        if n > 20
            l_sum = l_sum + l_inc(x(n),a);
        end
    end
    lyap(rct) = l_sum/(num-20);
    rct=rct+1;
end

r_range = linspace(rmin,rmax,length(lyap));
plot(r_range,lyap)
hold
plot(r_range,linspace(0,0,length(r_range)))
xlim([rmin, rmax])
numitr = num2str(num);
xlabel('\beta')
ylabel('\lambda_L')
title(['Lyapunov Exponent for Gauss iterated map, \alpha = 7, with Iterations = ',numitr])
    

function res = l_inc(x_i, a)
    df_dx = -2*a*exp(-a*x_i^2)*x_i;
    res = log(abs(df_dx)); 
end
