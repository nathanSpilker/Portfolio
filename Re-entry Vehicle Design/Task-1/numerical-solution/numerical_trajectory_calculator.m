%% Numerical Solution
close all
addpath("Complete 1976 Standard Atmosphere")

%% Constant Definition
Cd = [0.8, 1.4];
m = 40;
Re = 6563*1000; 
d = 1.53;
S = pi*(d/2)^2;

%% Initial conditions
z_i = 120*1000;
V_i = 7396.6;
gamma_i = -1.13*(pi/180);

%% Atmospheric model
[z,~,~,T,~, rho, ~, g, ~,~,~,~,~] = atmo(120, 0.01, 1);

%% ODE System 
delH = 10;
H_i = 0;
H_f = z_i;
steps = (H_f-H_i)/delH;

Vs2 = zeros(steps + 1, length(Cd));
gams2 = zeros(steps + 1, length(Cd));
Re_vec = zeros(steps + 1, length(Cd));

% for Reynolds number calculation
beta = 1.458e-6;
S_const = 110.4;
mu = beta*T.^1.5./(T+S_const);

for j = 1:length(Cd)
    kd1 = m/(S*Cd(j));
    H = H_i;
    Vs2(1,j) = V_i;
    gams2(1,j) = gamma_i;
    index = steps + 1;
    Re_vec(1,j) = rho(index)*Vs2(1,j)*d/mu(index);

    for i = 1: steps
        zplus = z_i - H - delH;
        index = index - 1;
        yp = step(Vs2(i,j), gams2(i,j), rho(index), g(index), z_i, Re, kd1, H, delH);
        Vs2(i+1,j) = yp(1);
        gams2(i+1,j) = yp(2);
        Re_vec(i+1,j) = rho(index)*Vs2(i+1,j)*d/mu(index);
        H = yp(3);
    end
end

figure(1)
plot(Vs2(:,1), linspace(H,0, 12001))
xlabel('Velocity (km/s)')
ylabel('Altitude (m)')
hold
plot(Vs2(:,2), linspace(H,0, 12001))
legend('Cd = 0.8', 'Cd = 1.4')
hold off

figure(2)
plot((gams2(:,1)*180/pi), linspace(H,0,12001))
xlabel('Gamma (rad)')
ylabel('Altitude (m)')
hold
plot((gams2(:,2)*180/pi), linspace(H,0, 12001))
legend('Cd = 0.8', 'Cd = 1.4')
hold off

figure(3)
plot(Re_vec(:,1), linspace(H,0, 12001))
xlabel('Reynolds Number')
ylabel('Altitude (m)')
hold on
plot(Re_vec(:,2), linspace(H,0, 12001))
legend('Cd = 0.8', 'Cd = 1.4')
title('Reynolds Number')
hold off

function yp = step(V, gam, rho, g, z_i, Re, kd, H, delH)
z = z_i - H - delH;
r = Re + z;
Vp = V + (0.5*rho*V*(1/(sin(gam)*kd)) + (g/V - V/r))*delH;
gamp = gam + (g/V^2 - 1/r)*(1/tan(gam))*delH;
Hp = H + delH;
yp = [Vp, gamp, Hp];
end