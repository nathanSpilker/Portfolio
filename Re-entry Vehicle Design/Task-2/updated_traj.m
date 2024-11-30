%% Numerical Solution
close all
%% Contant Definition
m = 40;
Re = 6563*1000; 
d = 1.53;
S = pi*(d/2)^2;
g_0 = 9.8;

cd_0 = [];
counter = 1;
sample_pts = [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

for i = 1:length(aero_db(:,1))
    if aero_db(i,2) == 0
        cd_0(counter) = aero_db(i,4);
        counter = counter + 1;
    end
end
%% Initial conditions
z_i = 120*1000;
V_i = 7396.6;
gamma_i = -1.13*(pi/180);

%% Atmospheric model
[z,~,~,T,~, rho, a, g, ~,~,~,~,~] = atmo(120, 0.01, 1);

%% ODE System 
delH = 10;
H_i = 0;
H_f = z_i;
steps = (H_f-H_i)/delH;

Vs = zeros(steps + 1, 1);
gams2 = zeros(steps + 1, 1);
Zvt = zeros(steps + 1, 1);
tfs = zeros(1, 1);
As = zeros(steps, 1);
qbars = zeros(steps, 1);
machs = zeros(steps+1, 1);


Vs(1,:) = V_i.*ones(1, 1);

gams(1,:) = gamma_i.*ones(1, 1);
dzdt(1,:) = (V_i*sin(gamma_i)).*ones(1, 1);

index = steps + 1;
H = H_i;
machs(1,:) = V_i/a(min(8601, steps + 1));

for i = 1: steps
    zplus = z_i - H - delH;
    index = index - 1;
    kd = m/(S*interpn(sample_pts, cd_0, max(min(machs(i,1),19),2)));
    yp = step(Vs(i,1), gams(i,1), rho(index), g(index), z_i, Re, kd, H, delH);
    Vs(i+1,1) = yp(1);
    gams(i+1,1) = yp(2);
    dzdt(i+1, 1) = (yp(1)*sin(yp(2)));
    t_step = (-10/dzdt(i+1, 1));
    tfs(1,1) = tfs(1,1) + t_step;
    As(i, 1) = ((Vs(i,1)-Vs(i+1, 1))/t_step)/g_0;
    qbars(i,1) = 0.5*rho(index)*(Vs(i+1, 1)^2);
    machs(i+1,1) = Vs(i+1,1)/a(min(8601, index));
    
    H = yp(3);

end

plot(Vs, linspace(H,0, 12001))
xlabel('Velocity (m/s)')
ylabel('Altitude (m)')
title('Velocity, Updated Kd')
figure

plot(gams, linspace(H,0,12001))
xlabel('Gamma (rad)')
ylabel('Altitude (m)')
title('Flight Path Angle, Updated Kd')
% 
% figure
% plot(dzdt, linspace(H,0,12001))
% xlabel('dz/dt (m/s)')
% ylabel('Altitude (m)')
% title('dz/dt')

figure
plot(As, linspace(H,0,12000))
xlabel('a/g')
ylabel('Altitude (m)')
title('G Loading, Updated Kd')

figure
plot(qbars, linspace(H,0,12000))
xlabel('Pa')
ylabel('Altitude (m)')
title('Dynamic Pressure, Updated Kd')

figure
plot(machs, linspace(H,0,12001))
xlabel('Mach')
ylabel('Altitude (m)')
title('Mach Number, Updated Kd')
disp(tfs)

function yp = step(V, gam, rho, g, z_i, Re, kd, H, delH)
z = z_i - H - delH;
r = Re + z;
Vp = V + (0.5*rho*V*(1/(sin(gam)*kd)) + (g/V - V/r))*delH;
gamp = gam + (g/V^2 - 1/r)*(1/tan(gam))*delH;
Hp = H + delH;
yp = [Vp, gamp, Hp];
end
