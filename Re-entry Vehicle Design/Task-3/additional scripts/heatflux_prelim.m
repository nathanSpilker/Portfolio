addpath("Complete 1976 Standard Atmosphere")

%% Input data from optimzed trajectory spreadsheet
%data = readtable('3DoF_Parameters_42.53kg_ANALYSIS2.xlsx');
n = 100; % resolution parameter (sampling rate) []
t = table2array(data(3:n:end,1)); % time [s]
v = table2array(data(3:n:end,2)); % velocity [m/s]
z = table2array(data(3:n:end,6)); % altitude [m]
fpa = table2array(data(3:n:end,9)); % flight path angle [deg]
alpha = 0; % angle of attack [deg]

%% graph optimized trajectory
% figure();
% yyaxis left
% plot(v,z);
% xlabel('Velocity (m/s)');
% ylabel('Altitude (m)')
% yyaxis right
% plot(v,fpa);
% ylabel('Flight Path Angle (degrees)');
% ylim([-90, 0]);
% legend('Velocity', 'FPA');

%% geometry specs
R_n = 272e-3; % [m]
theta = 45; % [deg], cone angle
L = (625e-3)*sin(theta); % [m] length of wedge side

%% defining constants
gamma = 1.4;
R = 287;
c_p = gamma*R/(gamma-1);
Pr = 0.73;
r = Pr^(1/2); % laminar flow recovery factor
% T_w = 1800; % assuming surface wall temp [K]

%% conditions at State 1 (incoming flow, atmosphere), before shock
[z_atm,~,~,T_atm,p_atm, rho_atm, ~, g, ~,~,~,~,~] = atmo(120, 0.01, 1);
z = round(z,-1);
V_1 = zeros(length(z),1);
rho_1 = zeros(length(z),1);
p_1 = zeros(length(z),1);
T_1 = zeros(length(z),1);
for i = 1:length(z)
    ind_atm = find(z_atm <= z(i)/1000 + 0.01 & z_atm >= z(i)/1000 - 0.01,1);
    V_1(i) = v(i);
    rho_1(i) = rho_atm(ind_atm);
    p_1(i) = p_atm(ind_atm);
    T_1(i) = T_atm(ind_atm);
end
a_1 = sqrt(gamma*R*T_1);
M_1 = V_1./a_1;

%% Shock relations for conditions at State 2, past normal shock
M_2 = zeros(length(M_1),1);
rho_2 = zeros(length(M_1),1);
p_2 = zeros(length(M_1),1);
T_2 = zeros(length(M_1),1);
for i = 1:length(M_1)
    if M_1(i)>1
        T_2(i) = (1 + 2*gamma*(M_1(i)^2 - 1)/(gamma+1))*(2 + ...
            (gamma-1)*(M_1(i)^2))*T_1(i)/((gamma+1)*(M_1(i)^2));
        M_2(i) = sqrt(((gamma-1)*(M_1(i)^2)+2)/(2*gamma*(M_1(i)^2)-(gamma-1)));
        rho_2(i) = (gamma+1)*(M_1(i)^2).*rho_1(i)/(2 + (gamma-1)*(M_1(i)^2));
        p_2(i) = (1 + 2*gamma*(M_1(i)^2 - 1)/(gamma+1))*p_1(i);
    else
        T_2(i) = T_1(i);
        M_2(i) = M_1(i);
        rho_2(i) = rho_1(i);
        p_2(i) = p_1(i);
    end
end
a_2 = sqrt(gamma*R*T_2);
V_2 = M_2.*a_2;

%% Stagnation Point
T_e = T_2;
rho_e = rho_2;
r = Pr^(1/2); % laminar flow recovery factor
c_p = gamma*R/(gamma-1);
T_aw = T_e + r*(V_2.^2)/(2*c_p);

% radiation constants
epsilon = 0.9; % approximate emissivity for ceramic []
sigma = 5.6695e-8; % Stefan-Boltzmann constant [W/m^2K^4]

% spherical-nosed body --> Tauber Menees relation
N = 0.5;
M_stag = 3;
h_aw = c_p*T_aw;
T_w = zeros(length(z),1);
h_w = zeros(length(z),1);
C_stag = zeros(length(z),1);
q_w_stag_TM = zeros(length(z),1);
T_w(1) = T_1(1);
for i = 1:length(z)
    h_w(i) = c_p*T_w(i);
    C_stag(i) = (1.83e-4)*(R_n^(-0.5))*(1-h_w(i)/h_aw(i));
    q_w_stag_TM(i) = tm(C_stag(i),rho_1(i),V_1(i),N,M_stag);
    if i < length(z)
        T_w(i+1) = (q_w_stag_TM(i)/(epsilon*sigma))^0.25;
    end
end

figure(1)
plot(T_w,z)
xlabel('T_w (K)')
ylabel('Altitude (m)')
title('Wall Temperature [K] based on Radiation Calcs');

% Sutherland's law setup
T_0_suth = 273; % [K]
T_suth = T_aw;
mu_0_suth = 1.716e-5; 
S_suth = 111; % Sutherland's constant

% Fay Riddell
A = 0.763;
C_pstag = 2*(p_2 - p_1)./(rho_1.*(V_1.^2));
due_dx = (1/R_n)*sqrt((2./rho_e).*(C_pstag*0.5.*rho_1.*V_1.^2));
mu = ((T_suth/T_0_suth).^(3/2)).*(T_0_suth + S_suth).*mu_0_suth...
    ./(T_suth + S_suth);
q_w_stag_FR = A*Pr^(-0.6)*(rho_e.*mu).^(0.5).*sqrt(due_dx).*(h_aw - h_w);

figure(2)
plot(q_w_stag_FR,z,q_w_stag_TM,z);
title('Heat Flux at Stagnation vs. Altitude');
ylabel('altitude [m]');
xlabel('Heat Flux q [W/m^2]');
legend('Fay Riddell','Tauber Menees');

%% Nose Cone
% geometry
M_nose = 3.2;
phi_range = 45;
phi = linspace(0,phi_range);
alpha = 90 - phi;
x = 2*pi*R_n*phi/360;

% DLR and Onera
q_w_stag = q_w_stag_TM;
a_DLR = 0.855;
b_DLR = 0.145;
a_ONERA = 0.825;
b_ONERA = 0.175;
q_w_nose_DLR = qw_nose(a_DLR, b_DLR, phi, q_w_stag);
q_w_nose_ONERA = qw_nose(a_ONERA, b_ONERA, phi, q_w_stag);

alt_max_q = find(q_w_stag_TM == max(q_w_stag_TM));

figure(3)
hold on
pick_alt = round(length(z)/10);
alts_plotted = [z(pick_alt) z(pick_alt*2) z(pick_alt*3) z(pick_alt*4)];
plot(x,q_w_nose_DLR(alt_max_q,:));
plot(x,q_w_nose_DLR(pick_alt,:));
plot(x,q_w_nose_DLR(pick_alt*2,:));
plot(x,q_w_nose_DLR(pick_alt*3,:));
plot(x,q_w_nose_DLR(pick_alt*4,:));
title("Heat Flux vs. 'x' Position along Nose Cone");
xlabel('x [m]');
ylabel('Heat Flux q [W/m^2]');
legend("Max q Altitude at " + z(alt_max_q)/1000 + " [km]", alts_plotted(1)/1000 + " [km]", ...
    alts_plotted(2)/1000 + " [km]", alts_plotted(3)/1000 + " [km]", alts_plotted(4)/1000 ...
    + " [km]");
xlim([0 max(x)]);
hold off

%% Wedge conditions
if M_1>1
    bet = beta(M_1,theta,gamma,0);
    Mn_2 = M_1*sin(bet*pi/180);
    T_3 = (1 + 2*gamma*(Mn_2.^2 - 1)/(gamma+1))*(2 + ...
        (gamma-1).*(Mn_2.^2)).*T_1/((gamma+1).*(Mn_2.^2));
    Mn_3 = sqrt(((gamma-1).*(Mn_2.^2)+2)./(2*gamma*(Mn_2.^2)-(gamma-1)));
    M_3 = Mn_3./(sin((bet-theta)*pi/180));
    a_3 = sqrt(gamma*R*T_3);
    V_3 = M_3.*a_3;
else
    T_3 = T_1;
    M_3 = M_1;
    a_3 = a_1;
    V_3 = V_1;
end
T_aw_wedge = T_3 + r*(V_3.^2)/(2*c_p);

% Tauber Menees
%s = linspace(0,R_n*cosd(phi_range)+L);
s = linspace(max(x), max(x) + L); % curvilinear coordinate along wedge [m]
C_coeff = 4.03e-5; % might also be 4.03e-9 or 2.53e-9
T_w_wedge = zeros(length(z),100);
C_wedge = zeros(length(z),100);
q_w_stag_TM = zeros(length(z),100);
T_w_wedge(1,:) = T_1(1);
for i = 1:length(z)
        C_wedge(i,:) = C_coeff*(cosd(theta)^0.5)*sind(theta)*...
            (s.^(-0.5)).*(1-T_w_wedge(1,:)./T_aw_wedge(i));
        q_w_wedge_TM(i,:) = tm(C_wedge(i,:),rho_1(i),V_1(i),N,M_stag);
    if i < length(z)
        T_w_wedge(i+1,:) = (q_w_wedge_TM(i,:)/(epsilon*sigma)).^0.25;
    end
end

%pos = s-R_n*cosd(phi_range);
pos = s - max(x); % position along wedge, starting at 0 [m]

figure(4)
hold on
plot(pos,q_w_wedge_TM(alt_max_q,:));
plot(pos,q_w_wedge_TM(pick_alt,:));
plot(pos,q_w_wedge_TM(pick_alt*2,:));
plot(pos,q_w_wedge_TM(pick_alt*3,:));
plot(pos,q_w_wedge_TM(pick_alt*4,:));
title("Heat Flux vs. 's' Position along Conical Section");
xlabel('s [m]');
ylabel('Heat Flux q [W/m^2]');
legend("Max q Altitude at " + z(alt_max_q)/1000 + " [km]", alts_plotted(1)/1000 + " [km]", ...
    alts_plotted(2)/1000 + " [km]", alts_plotted(3)/1000 + " [km]", alts_plotted(4)/1000 ...
    + " [km]");
xlim([0 max(s-R_n*cosd(phi_range))]);
hold off

figure(5)
hold on
% nose plots
plot(x,q_w_nose_DLR(alt_max_q,:), 'Color', 'b');
plot(x,q_w_nose_DLR(pick_alt,:), 'Color', 'r');
plot(x,q_w_nose_DLR(pick_alt*2,:), 'Color', 'y');
plot(x,q_w_nose_DLR(pick_alt*3,:), 'Color', 'm');
plot(x,q_w_nose_DLR(pick_alt*4,:), 'Color', 'g');
% wedge plots
s_start = 1;
sub_s = s;(s_start:length(s));
plot(sub_s,q_w_wedge_TM(alt_max_q,s_start:length(s)), '--', 'Color', 'b');
plot(sub_s,q_w_wedge_TM(pick_alt,s_start:length(s)), '--', 'Color', 'r');
plot(sub_s,q_w_wedge_TM(pick_alt*2,s_start:length(s)), '--', 'Color', 'y');
plot(sub_s,q_w_wedge_TM(pick_alt*3,s_start:length(s)), '--', 'Color', 'm');
plot(sub_s,q_w_wedge_TM(pick_alt*4,s_start:length(s)), '--', 'Color', 'g');
xlabel('position [m]');
ylabel('Heat Flux q [W/m^2]');
xlim([0 max(s-R_n*cosd(phi_range))]);
legend("Max q Altitude at " + z(alt_max_q)/1000 + " [km]", alts_plotted(1)/1000 + " [km]", ...
    alts_plotted(2)/1000 + " [km]", alts_plotted(3)/1000 + " [km]", alts_plotted(4)/1000 ...
    + " [km]");
title("Heat Flux vs. Position along Combined Body of Nose and Conical Section");
hold off

function TauberMenees = tm(C,rho,vel,N,M)
    TauberMenees = C.*(rho.^N).*(vel.^M);
end

function nose = qw_nose(a,b,phi,qw)
    nose = (a*(cosd(phi).^(3/2)) + b).*qw;
end

% n = 0 for weak shock, n = 1 for strong shock
function Beta = beta(M,theta,gam,n)
theta=theta*pi/180;             % convert to radians
mu=asin(1/M);                   % Mach wave angle
c=tan(mu)^2;
a=((gam-1)/2+(gam+1)*c/2)*tan(theta);
b=((gam+1)/2+(gam+3)*c/2)*tan(theta);
d=sqrt(4*(1-3*a*b)^3/((27*a^2*c+9*a*b-2)^2)-1);
Beta=atan((b+9*a*c)/(2*(1-3*a*b))-(d*(27*a^2*c+9*a*b-2))/...
    (6*a*(1-3*a*b))*tan(n*pi/3+1/3*atan(1/d)))*180/pi;
end