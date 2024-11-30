%% Runs Stag Temperature Distribution for Multiple TPS Layers 
close all

%% Nose Properties 

% L1 = FW12 UHTC
% L2 = RESCOR 310M
% L3 = INTEK-PFI-1120 FOAM
% L4 = FW12 UHTC


cp_nose = [1050, 1457, 1009, 1050];
lambda_nose = [2.73, 0.187, 0.046, 2.73];
Top_nose = [1700, 1650, 300, 1700] + 273;
rho_nose = [2900, 800, 6.4, 2900];
epsf_nose = 0.87;
epsb_nose = 0.87;
Tmax_nose = 70 + 273;
Mmax_nose = 3.5;

%% Cone Properties

% L1 = NEXTEL 312
% L2 = PYROGEL 6650
% L3 = SIGRATHERM
% L4 = NEXTEL 312

cp_cone = [1046.7, 1150, 700, 1046.7];
lambda_cone = [0.152, 0.026, 0.087 ,0.152];
Top_cone = [1800, 600, 1000, 1800] + 273;
rho_cone = [2700, 112, 92, 2700];

epsf_cone = 0.88;
epsb_cone = 0.88;
Tmax_cone = 70 + 273;
Mmax_cone = 5.5;

%% Cone Optimization 

L_sec = [.00025, 0.04, 0.01, 0.00025];

N = 500 + 1;
timesteps = 500;
theta = 45;
r_nose = 0.544/2;
r_base = 1.530/2;

options = optimoptions('fmincon', 'MaxIterations', 50, 'MaxFunctionEvaluations', 50, 'Algorithm','sqp');
sol = fmincon(@(L) calc_mass_cone(L, rho_cone, r_base, r_nose, theta), L_sec, [], [], [], [], [0.00020, 0.00020, 0.00020, 0.00020], [.1,.1,.2,.1], @(L) constraint(L, lambda_cone, rho_cone, cp_cone, epsf_cone, epsb_cone, N, timesteps, Top_cone(1), Tmax_cone), options);

%% Helper Function
function [c, ceq] = constraint(L, lambda, rho, cp, epsf, epsb, N, timesteps, T_op, T_back_req)
    T_cone = TPS_cone_function(lambda, rho, cp, epsf, epsb, L, N, timesteps);
    T_max_front = max(T_cone(1,:));
    T_max_back = max(T_cone(N,:));
    disp(['T_front = ', num2str(T_max_front)])
    c = [];
    ceq = [T_max_front - T_op, T_max_back - T_back_req];
end

function mass_nose = calc_mass_nose(L_sec, rho_nose, r_nose, theta)
    masses = zeros(length(L_sec),1);
    r_outer = r_nose;
    for i = 1:length(L_sec)
       r_inner = r_outer-L_sec(i);
       masses(i) = (pi/3)*(2+cosd(theta))*(1-cosd(theta))^2*rho_nose(i)*(r_outer^3 - r_inner^3);
       r_outer = r_inner;
    end
    mass_nose = sum(masses);
end 

function mass_cone = calc_mass_cone(L_sec, rho_cone, r_base, r_nose, theta)
    masses = zeros(length(L_sec),1);
%     disp(L_sec)
    R_out = r_base;
    r_out = r_nose*sind(theta);
    for i = 1:length(L_sec)

       R_in = R_out-L_sec(i);
       r_in = r_out-L_sec(i)/cosd(theta);
       
       h_out = (R_out-r_out)*tand(theta);
       h_in = h_out;
       
       masses(i) = rho_cone(i)*((1/3)*pi*h_out*(r_out^2+r_out*R_out+R_out^2)-(1/3)*pi*h_in*(r_in^2+r_in*R_in+R_in^2));
       r_out = r_in;
       R_out = R_in;
    end
    mass_cone = sum(masses);
    str = ['Mass = ',num2str(mass_cone)];
    disp(str)
end 
