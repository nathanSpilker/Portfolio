clear
rmin = 2.1;
rmax = 3.99;
x0 = 0.1;
num = 1000;



rmn = round(rmin*1000); 
rmx = round(rmax*1000);
rct = 1; %rct is a counter for the number of r-values interated
for r = rmn:rmx
    x(1)=x0; %set initial condition
        rdec = r/1000; % convert back to decimal r
        l_sum = 0;
    for n=2:num
        x(n)=rdec*x(n-1)*(1-x(n-1));
        if n > 20
            l_sum = l_sum + l_inc(x(n),rdec);
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
xlabel('\lambda')
ylabel('\lambda_L')
title(['Lyapunov Exponent for logisitc map with Iterations = ',numitr])
    

function res = l_inc(x_i, r)
    df_dx = r - 2*r*x_i;
    res = log(abs(df_dx)); 
end

