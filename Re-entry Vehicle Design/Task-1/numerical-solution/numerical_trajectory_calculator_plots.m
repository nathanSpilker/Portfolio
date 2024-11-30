%% Numerical Solution
close all
%% Contant Definition
Cd = [0.8, 1.0, 1.2, 1.4];
m = 40;
Re = 6563*1000; 
d = 1.53;
S = pi*(d/2)^2;
kd = m./(S.*Cd);
g_0 = 9.8;

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

Vs = zeros(steps + 1, length(Cd));
gams2 = zeros(steps + 1, length(Cd));
Zvt = zeros(steps + 1, length (Cd));
tfs = zeros(1, length(Cd));
As = zeros(steps, length(Cd));
qbars = zeros(steps, length(Cd));
machs = zeros(steps, length(Cd));


Vs(1,:) = V_i.*ones(1, length(Cd));
gams(1,:) = gamma_i.*ones(1, length(Cd));
dzdt(1,:) = (V_i*sin(gamma_i)).*ones(1, length(Cd));

for j = 1: length(Cd)
    index = steps + 1;
    H = H_i;
    
    for i = 1: steps
        zplus = z_i - H - delH;
        index = index - 1;
        yp = step(Vs(i,j), gams(i,j), rho(index), g(index), z_i, Re, kd(j), H, delH);
        Vs(i+1,j) = yp(1);
        gams(i+1,j) = yp(2);
        dzdt(i+1, j) = (yp(1)*sin(yp(2)));
        t_step = (-10/dzdt(i+1, j));
        tfs(1,j) = tfs(1,j) + t_step;
        As(i, j) = ((Vs(i,j)-Vs(i+1, j))/t_step)/g_0;
        qbars(i,j) = 0.5*rho(index)*(Vs(i+1, j)^2);
        machs(i,j) = Vs(i+1,j)/a(min(8601, index));
        
        H = yp(3);
        
    end
end

plot(Vs, linspace(H,0, 12001))
xlabel('Velocity (m/s)')
ylabel('Altitude (m)')
legend('Cd = 0.8', 'Cd = 1.0', 'Cd = 1.2', 'Cd = 1.4')
title('Velocity')
figure

plot(gams, linspace(H,0,12001))
xlabel('Gamma (rad)')
ylabel('Altitude (m)')
legend('Cd = 0.8', 'Cd = 1.0', 'Cd = 1.2', 'Cd = 1.4')
title('Flight Path Angle')

figure
plot(dzdt, linspace(H,0,12001))
xlabel('dz/dt (m/s)')
ylabel('Altitude (m)')
legend('Cd = 0.8', 'Cd = 1.0', 'Cd = 1.2', 'Cd = 1.4')
title('dz/dt')

figure
plot(As, linspace(H,0,12000))
xlabel('a/g')
ylabel('Altitude (m)')
legend('Cd = 0.8', 'Cd = 1.0', 'Cd = 1.2', 'Cd = 1.4')
title('G Loading')

figure
plot(qbars, linspace(H,0,12000))
xlabel('Pa')
ylabel('Altitude (m)')
legend('Cd = 0.8', 'Cd = 1.0', 'Cd = 1.2', 'Cd = 1.4')
title('Dynamic Pressure')

figure
plot(machs, linspace(H,0,12000))
xlabel('Mach')
ylabel('Altitude (m)')
legend('Cd = 0.8', 'Cd = 1.0', 'Cd = 1.2', 'Cd = 1.4')
title('Mach Number')
disp(tfs)

Hs = flip(linspace(0, 120000, 12001)).';
matrix = [Vs(:, 1), flip(T), flip(rho), [machs(:,1);0], gams(:,1), Hs];

test_matrix = zeros(12, 6);
for i = 1:12
    test_matrix(i,:) = matrix(1000*i + 1,:);
end

function yp = step(V, gam, rho, g, z_i, Re, kd, H, delH)
z = z_i - H - delH;
r = Re + z;
Vp = V + (0.5*rho*V*(1/(sin(gam)*kd)) + (g/V - V/r))*delH;
gamp = gam + (g/V^2 - 1/r)*(1/tan(gam))*delH;
Hp = H + delH;
yp = [Vp, gamp, Hp];
end

