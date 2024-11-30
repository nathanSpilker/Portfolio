addpath("Complete 1976 Standard Atmosphere")

%% define variables for analytical solution trajectory
ve_a = 7396.6; % entry velocity [m/s]
m_a = 40; % capsule mass [kg]
dmax_a = 1530e-3; % capsule max diameter [m]
S_a = pi*(dmax_a)^2; % frontal area [m^2]
Cd_a = [0.8; 1.4]; % drag coefficient []
kd_a = m_a./(S_a*Cd_a); % ballistic coefficient []
beta_a = 1/6900; % 1/scale height [m^-1]
gammae_a = [-1.13, -10, -40, -60]; % entry angles [deg]
[z_a,~,~, T_a,~, rho_a,~,~,~,~,~,~,~] = atmo(120,.01,1); % atmospheric model

%% solve for v(z)
v_a = ve_a.*exp((rho_a-rho_a(end))./[(2.*kd_a(1).*beta_a.*sind(gammae_a)), ...
    (2.*kd_a(2).*beta_a.*sind(gammae_a))]); % velocities, columns 1-4 are for Cd=0.8 [m/s]

%% plot flight path
figure();
plot(v_a, z_a);
title('Analytical Flight Path');
xlabel('Speed (m/s)');
ylabel('Altitude (km)');
legend('\gamma_e=-1.4, C_d=0.8','\gamma_e=-10, C_d=0.8','\gamma_e=-40, C_d=0.8','\gamma_e=-60, C_d=0.8',...
    '\gamma_e=-1.4, C_d=1.4','\gamma_e=-10, C_d=1.4','\gamma_e=-40, C_d=1.4','\gamma_e=-60, C_d=1.4');

%% solve for other parameters in flight scenario
q_a = 0.5*rho_a.*((v_a).^2); % dynamic pressure [N/m^2]
c_a = sqrt(1.4*287*T_a); % speed of sound [m/s]
M_a = v_a./c_a; % Mach number []
a_a = [diff(v_a)./diff(z_a);zeros(1,8)].*v_a.*sind([gammae_a, gammae_a]); % deceleration [m/s^2]
Rearth_a = 6371 * 1000; % Earth radius [m]
ge_a = -9.81; % gravitational acceleration at Earth's surface [m/s^2]
g_a = ge_a./((1 + z_a/Rearth_a).^2); % gravitational acceleration [m/s^2]
deccel_a = a_a./g_a; % normalized acceleration

%% plot dynamic pressure
figure();
plot(q_a, z_a);
title('Analytical Dynamic Pressure');
xlabel('Dynamic Pressure (N/m^2)');
ylabel('Altitude (km)');
legend('\gamma_e=-1.4, C_d=0.8','\gamma_e=-10, C_d=0.8','\gamma_e=-40, C_d=0.8','\gamma_e=-60, C_d=0.8',...
    '\gamma_e=-1.4, C_d=1.4','\gamma_e=-10, C_d=1.4','\gamma_e=-40, C_d=1.4','\gamma_e=-60, C_d=1.4');

%% plot Mach number
figure();
plot(M_a, z_a);
title('Analytical Mach Number');
xlabel('Mach Number');
ylabel('Altitude (km)');
legend('\gamma_e=-1.4, C_d=0.8','\gamma_e=-10, C_d=0.8','\gamma_e=-40, C_d=0.8','\gamma_e=-60, C_d=0.8',...
    '\gamma_e=-1.4, C_d=1.4','\gamma_e=-10, C_d=1.4','\gamma_e=-40, C_d=1.4','\gamma_e=-60, C_d=1.4');

%% plot normalized deceleration
figure();
plot(deccel_a, z_a);
title('Analytical Decceleration');
xlabel('Decceleration (a/g)');
ylabel('Altitude (km)');
legend('\gamma_e=-1.4, C_d=0.8','\gamma_e=-10, C_d=0.8','\gamma_e=-40, C_d=0.8','\gamma_e=-60, C_d=0.8',...
    '\gamma_e=-1.4, C_d=1.4','\gamma_e=-10, C_d=1.4','\gamma_e=-40, C_d=1.4','\gamma_e=-60, C_d=1.4');