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
% L3 = SIGRATHERM
% L2 = PYROGEL 6650
% L4 = NEXTEL 312

cp_cone = [1046.7, 700,1150,  1046.7];
lambda_cone = [0.15, 0.055, 0.02, 0.15];
Top_cone = [1800, 1000, 650, 1800] + 273;
rho_cone = [2700, 92, 112, 2700];

epsf_cone = 0.88;
epsb_cone = 0.88;
Tmax_cone = 70 + 273;
Mmax_cone = 5.5;

% %% Nose Optimization 
% 
% L_sec = [0.003, 0.04, 0.025, 0.002];
% L0 = sum(L_sec);
% dL_back = [0,0,0.00075,0];
% dL_front_1 = [0.0001,0.0005,0,0];
% dL_front_2 = [0,0.0005,0,0];
% N = 500 + 1;
% timesteps = 500;
% itrs = 1e4;
% theta = 45;
% r_nose = 0.544/2;
% vol_nose = pi/3 * r_nose^3 *(2 + cosd(theta))*(1-cosd(theta)^2);
% Topt = false;
% L_sol = 0;
% for i=1:itrs
%     T_nose = TPS_stag_function(lambda_nose, rho_nose, cp_nose, epsf_nose, epsb_nose, L_sec, N, timesteps);
%     
%     T_max = max(T_nose(N,:));
%     M = calc_mass_nose(L_sec, rho_nose, r_nose, theta);
%     disp(T_max)
%     disp(M)
%     if T_max > Tmax_nose
%        L_sec = L_sec + dL_back;
%     else
%         Topt = true;
%     end
%     
%     if Topt
%         T_max_front = max(T_nose(1,:));
%         disp(T_max_front)
%         if T_max_front > Top_nose(1)
%             L_sec = L_sec + dL_front_1;
%         else
%             if calc_mass_nose(L_sec, rho_nose, r_nose, theta) < Mmax_nose
%                 L_sol = L_sec;
%                 break
%             else
%                 L_sec = L_sec - dL_front_2;
%             end
%         end 
%     end
%     Topt = false;
%     disp(L_sec)
% end
% disp("FOUND SOLUTION")
% disp(L_sol)


%% Cone Optimization 

L_sec = [0.00025, 0.013, 0.03, 0.00025];

N = 500 + 1;
timesteps = 500;

dL_back = [0,0.0005,0.0001,0];
dL_front_1 = [0.0001,0.0005,0,0];
dL_front_2 = [0,0.0005,0,0];

itrs = 1;
theta = 45;
r_nose = 0.544/2;
r_base = 1.530/2;
Topt = false;
L_sol = 0;
for i=1:itrs
    T_cone = TPS_cone_function(lambda_cone, rho_cone, cp_cone, epsf_cone, epsb_cone, L_sec, N, timesteps);
    
    T_max = max(T_cone(N,:));
    Tfront_max = max(T_cone(1,:));
    M = calc_mass_cone(L_sec, rho_cone, r_base, r_nose, theta);
    disp(['Iteration = ', num2str(i)])
    disp(['Mass = ', num2str(M)])
    disp(['T_back = ', num2str(T_max)])
    disp(['T_front = ', num2str(Tfront_max)])
    if T_max > Tmax_cone
       L_sec = L_sec + dL_back;
    else
        Topt = true;
    end
    
    if Topt
        T_max_front = max(T_cone(1,:));
        if T_max_front > Top_cone(1)
            L_sec = L_sec + dL_front_1;
        else
            if calc_mass_cone(L_sec, rho_cone, r_base, r_nose, theta) < Mmax_cone
                L_sol = L_sec;
                break
            else
                L_sec = L_sec - dL_front_2;
            end
        end 
    end
    Topt = false;
end
% disp("FOUND SOLUTION")
% disp(L_sol)

%% Helper Function

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
    R_out = r_base;
    r_out = r_nose*sind(theta);
    for i = 1:length(L_sec)
       R_in = R_out-L_sec(i);
       r_in = r_out-L_sec(i)/cosd(theta);
       
       h_out = (R_out-r_out)*tand(theta);
       
       h_in = h_out;
       
       masses(i) = rho_cone(i)*((1/3)*pi*h_out*(r_out^2+r_out*R_out+R_out^2)-(1/3)*pi*h_in*(r_in^2+r_in*R_in+R_in^2)-L_sec(i)*(1/cosd(theta))*2*pi*(r_out)/2);

       r_out = r_in;
       R_out = R_in;
    end
    mass_cone = sum(masses);
end 



