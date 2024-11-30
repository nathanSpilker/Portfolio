clear
alpha = 7.1;
rmin = -1;
rmax = 1;
xo = 0.1;
num = 500;
num2 = num/4;

rmn = round(rmin*1000); %Matlab requires integer subscripts
rmx = round(rmax*1000);
rct = 0; %rct is a counter for the number of r-values interated
ir = 0;
for r = rmn:rmx
    x(1)=xo; %set initial condition--Matlab requires subscript > 0
        rdec = r/1000; % converts back to decimal r
    for n=2:num
        x(n)=exp(-alpha*x(n-1)^2)+rdec;
        if n > num2
            ir = ir + 1;
            itx(ir) = x(n); %after the first num2 iterations
            rv(ir)=rdec;
        end
    end
    rct=rct+1;
end


plot(rv,itx,'.')
xlim([rmin, rmax])
ylim([-1, 1.5])
numitr = num2str(num);
xlabel('\lambda')
ylabel('x_n')
title(['Bifurcation Diagram for Logistic Map, with Iterations = ',numitr])




