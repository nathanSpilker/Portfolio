%% Nose cone setup (FW12)
sig = 5.6695e-8; % Stefan-Boltzmann constant [W/(m^2K^4)]
% FW12 properties
T_FW12 = [300, 600, 900, 1100]; % temperature range [k}
lambda_FW12 = [3.80, 2.81, 2.30, 2.02]; % thermal conductivity [W/(mK)]
rho_FW12 = 2900; % FW12 density [kg/m^3]
c_FW12 = 1050; % FW12 specific heat capacity [J/(kgK)]
T_op_FW12 = 1700; % FW12 max operating temp [K]
eps_FW12 = 0.87; % FW12 emissivity []
% nosecone incident conditions (stagnation)
T_stag = T_w; % wall temperature at stagnation point, get from Task 3 [K]
lambda_nose_traj = interp1(T_FW12, lambda_FW12, T_stag, 'spline'); % thermal conductivity along the trajectory [W/(mK)]
alpha_nose_traj = lambda_nose_traj/(rho_FW12*c_FW12); % stagnation thermal diffusivity [m^2/s]
q_c_stag = q_w_stag; % heat flux at stagnation point, get from Task 3 [W/m^2]
% q_r_stag = eps_FW12*sig*T_stag.^4; % heat radiated out of front wall [W/m^2]
% q_cond_stag = q_c_stag - q_r_stag; % heat conducted into TPS [W/m^2]

%% create matrix & vectors for numerical solution
N = 10; % y grid dimension []
L = 0.1; % TPS thickness [m]
% T_initial = zeros(N,1)+T_stag(1); % initial temp, front to back [K]
% lambda_initial = interp1(T_FW12, lambda_FW12, T_initial, 'spline');
% alpha_initial = lambda_initial/(rho_FW12*c_FW12);
delta_t = max(t)/N; % time step [s]
delta_y = L/N; % length step [m]
T_nose = zeros(N, length(t)); % temp at all altitudes through TPS
T_nose(:, 1) = T_stag(1); % initial temperature
b_nose = zeros(N, 1);
A_nose = zeros(N);
q_nose = zeros(N, 1);
A_nose(1,1) = -1;
A_nose(1,2) = 1;
A_nose(N,N-1) = -1;
A_nose(N,N) = 1;
k=2;
for n = 2:round(length(t)/k) % go through every time step
    lambda_nose = interp1(T_FW12, lambda_FW12, T_nose(:,n-1), 'spline');
    alpha_nose = lambda_nose/(rho_FW12*c_FW12);
    q_nose(1) = -(delta_y/lambda_nose(1))*(q_c_stag(n-1)...
        - eps_FW12*sig*T_nose(1,n-1)^4);
    q_nose(N) = -(delta_y/lambda_nose(N))* eps_FW12*sig*T_nose(N,n-1)^4;
    for i = 2:N-1
        b_nose(i) = 0.5*0.5*(alpha_nose(i)+alpha_nose(i+1))*delta_t/(delta_y^2);
    end
    for i = 2:N-1
        A_nose(i, i-1) = -b_nose(i);
        if i < (N-1) % every row except 2nd to last row
            A_nose(i, i) = 1 + b_nose(i) + b_nose(i+1);
            A_nose(i, i+1) = -b_nose(i+1);
            q_nose(i) = b_nose(i)*T_nose(i-1,n-1) + ...
                (1-b_nose(i)-b_nose(i+1))*T_nose(i,n-1) + b_nose(i+1)*T_nose(i+1,n-1);
        else 
            A_nose(i, i) = 1 + b_nose(i-1) + b_nose(i);
            A_nose(i, i+1) = -b_nose(i);
            q_nose(i) = b_nose(i)*T_nose(i-1,n-1) + ...
                (1-b_nose(i-1)-b_nose(i))*T_nose(i,n-1) + b_nose(i)*T_nose(i+1,n-1);
        end
    end
    A_nose_inv = inv(A_nose);
    T_nose(:,n) = A_nose_inv*q_nose;
    C_stag = 1.83e-4 * R_n^(-.5) * (1 - T_nose(1,n)/T_aw(n)); % Tauber Menees constant for cylinder
    q_c_stag(n) = C_stag * rho_1(n)^.5 * V_1(n)^3;
end
hold on
for m = 1:N
    plot(t(1:round(length(t)/k)), T_nose(m,1:round(length(t)/k))); % plot time evolution of a given point in the TPS
end
xlabel('time (s)');
ylabel('temperature (K)');
title('Temperature throughout TPS (FW12)');

%% Nextel 312 (flexible shell)
T_N312 = [493.15, 873.15, 1253.15, 1573.15, 1773.15]; % temperature [k}
lambda_N312 = [0.11,0.138,0.158,0.168,0.185];%thermal conductivity [W/(mK)]
T_cone = real(T_w_wedge(:,ceil(size(T_w_wedge,2)/2)));
lambda_cone = interp1(T_N312, lambda_N312, T_cone, 'spline');

%% plot temperature vs time
plot(t, T_stag);