%% Nose cone setup (FW12)
sig = 5.6695e-8; % Stefan-Boltzmann constant [W/(m^2K^4)]
% FW12 properties
lambda_FW12 = mean([3.80, 2.81, 2.30, 2.02]); % thermal conductivity [W/(mK)]
rho_FW12 = 2900; % FW12 density [kg/m^3]
c_FW12 = 1050; % FW12 specific heat capacity [J/(kgK)]
T_op_FW12 = 1700; % FW12 max operating temp [K]
eps_FW12 = 0.87; % FW12 emissivity []
alpha_FW12 = lambda_FW12/(rho_FW12*c_FW12); % thermal diffusivity [m^2/s]

%% set up conditions with equal timesteps
timesteps = 1000; % number of timesteps, increase for resolution []
t_nose = linspace(0, max(t), timesteps); % evenly spaced time vector [s]
V_inf = interp1(t, V_1, t_nose, 'spline'); % velocity at timesteps [m/s]
rho_inf = interp1(t, rho_1, t_nose, 'spline'); % density at timesteps [kg/m^3]
T_aw_nose = interp1(t, T_aw, t_nose, 'spline'); % velocity at timesteps [m/s]

%% create matrix & vectors for numerical solution
N = 1000; % y grid dimension []
L = 0.1; % TPS thickness [m]
delta_t = max(t_nose)/length(t_nose); % time step [s]
delta_y = L/N; % length step [m]
T_nose = zeros(N, length(t_nose)); % temp at all altitudes through TPS
T_nose(:, 1) = 343;%T_1(1); % initial temperature = atmospheric
q_c_stag = zeros(length(t_nose),1);
b_nose = zeros(N, 1); % b's that go into A matrix
A_nose = zeros(N); % A matrix
q_nose = zeros(N, 1); % q vector for time n+1
A_nose(1,1) = -1;
A_nose(1,2) = 1;
A_nose(N,N-1) = -1;
A_nose(N,N) = 1;
for i = 2:N
    b_nose(i) = 0.5*0.5*(alpha_FW12+alpha_FW12)*delta_t/(delta_y^2);
end
for i = 2:N-1
    A_nose(i, i-1) = -b_nose(i);
    A_nose(i, i) = 1 + b_nose(i) + b_nose(i+1);
    A_nose(i, i+1) = -b_nose(i+1);
end
A_nose_inv = inv(A_nose);
k=2;
for n = 2:round(length(t_nose)/k) % go through every time step
    C_stag = 1.83e-4 * R_n^(-.5) * (1 - T_nose(1,n-1)/T_aw_nose(n-1));
    q_c_stag(n-1) = C_stag * rho_inf(n-1)^.5 * V_inf(n-1)^3;
    q_nose(1) = -(delta_y/lambda_FW12)*(q_c_stag(n-1)...
        - eps_FW12*sig*T_nose(1,n-1)^4);
    q_nose(N) = -(delta_y/lambda_FW12)* eps_FW12*sig*T_nose(N,n-1)^4;
    for i = 2:N-1
        q_nose(i) = b_nose(i)*T_nose(i-1,n-1) + ...
            (1-b_nose(i)-b_nose(i+1))*T_nose(i,n-1) + b_nose(i+1)*T_nose(i+1,n-1);
    end
    A_nose_inv = inv(A_nose);
    T_nose(:,n) = A_nose_inv*q_nose;
end
%% plot temperature distribution throughout flightpath
figure()
hold on
p = zeros(1,N); % p array to specify legend items later
for m = 1:(round(N/10)):N
    if m == 1
        p(m) = plot(t_nose(1:round(length(t_nose)/k)), ...
             T_nose(m,1:round(length(t_nose)/k)),'--'); % plot front face
    else
        p(m) = plot(t_nose(1:round(length(t_nose)/k)), ...
            T_nose(m,1:round(length(t_nose)/k))); % plot middle layers
    end
end
p(N) = plot(t_nose(1:round(length(t_nose)/k)), ...
    T_nose(N,1:round(length(t_nose)/k)),'--'); % plot back face
p(2) = plot(t_nose(1:round(length(t_nose)/k)), ...
    zeros(1,round(length(t_nose)/k))+T_op_FW12,'r'); % plot operating temp
p(3) = plot(t_nose(1:round(length(t_nose)/k)), ...
    zeros(1,round(length(t_nose)/k))+343,'k'); % plot max back face temp
xlabel('time (s)');
ylabel('temperature (K)');
title('Temperature throughout TPS (FW12)');
legend([p(1),p(N),p(2),p(3)],'front face','back face','T_{op}','70{\circ}C', 'Location', 'best');

%% plot temperature distrubtion throughout TPS
y = linspace(0, L, N);
figure()
hold on
for j = 1:(round(timesteps/10)):timesteps/k
    plot(y, T_nose(:, j),'DisplayName',"t = " + (j-1)*delta_t + " s");
end
plot(y, T_nose(:, timesteps/k), 'DisplayName', "t = " + max(t_nose)/k + " s"); % plot final time that's being calculated
plot(y, zeros(1,N)+T_op_FW12,'r--', 'DisplayName', 'T_{op}'); % operating temp
plot(y, zeros(1,N)+343,'k--', 'DisplayName', '70{\circ}C'); % max back face temp
xlabel('y (m)');
ylabel('temperature (K)');
title('Temperature through TPS thickness (FW12)');
legend('show', 'Location', 'best');