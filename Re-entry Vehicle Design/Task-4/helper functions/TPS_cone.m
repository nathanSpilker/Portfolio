%% Wedge/Cone setup (Nextel 312)
sig = 5.6695e-8; % Stefan-Boltzmann constant [W/(m^2K^4)]
theta = 45; % cone angle [deg]
L_cone = (625e-3)/cosd(theta); % length of wedge side [m]
s_cone = 2*pi*R_n*(theta/360) + L_cone/2; % curvilinear coord of wedge midpoint [m]
% Nextel 312 properties
lambda_N312 = mean([0.11,0.138,0.158,0.168,0.185]); % thermal conductivity [W/(mK)]
rho_N312 = 2700; % Nextel 312 density [kg/m^3]
c_N312 = 1046.7; % Nextel 312 specific heat capacity [J/(kgK)]
T_op_N312 = 1800; % Nextel 312 max operating temp [K]
eps_N312 = 0.88; % Nextel 312 emissivity []
alpha_N312 = lambda_N312/(rho_N312*c_N312); % thermal diffusivity [m^2/s]

%% set up conditions with equal timesteps
timesteps = 1000; % number of timesteps, increase for resolution []
t_cone = linspace(0, max(t), timesteps); % evenly spaced time vector [s]
V_inf = interp1(t, V_1, t_cone, 'spline'); % velocity at timesteps [m/s]
rho_inf = interp1(t, rho_1, t_cone, 'spline'); % density at timesteps [kg/m^3]
T_aw_cone = interp1(t, T_aw_wedge, t_cone, 'spline'); % velocity at timesteps [m/s]

%% create matrix & vectors for numerical solution
N = 1000; % y grid dimension []
L = 0.025; % TPS thickness [m]
delta_t = max(t_cone)/length(t_cone); % time step [s]
delta_y = L/N; % length step [m]
T_cone = zeros(N, length(t_cone)); % temp at all altitudes through TPS
T_cone(:, 1) = 343; %T_1(1); % initial temperature = atmospheric [K]
q_c_wedge = zeros(length(t_cone),1);
b_cone = zeros(N, 1); % b's that go into A matrix
A_cone = zeros(N); % A matrix
q_cone = zeros(N, 1); % q vector for time n+1
A_cone(1,1) = -1;
A_cone(1,2) = 1;
A_cone(N,N-1) = -1;
A_cone(N,N) = 1;
for i = 2:N
    b_cone(i) = 0.5*0.5*(alpha_N312+alpha_N312)*delta_t/(delta_y^2);
end
for i = 2:N-1
    A_cone(i, i-1) = -b_cone(i);
    A_cone(i, i) = 1 + b_cone(i) + b_cone(i+1);
    A_cone(i, i+1) = -b_cone(i+1);
end
A_nose_inv = inv(A_cone);
k=2;
for n = 2:round(length(t_cone)/k) % go through time steps
    C_wedge = 4.03e-5*((cosd(theta))^0.5)*sind(theta)*s_cone^(-0.5)*...
        (1 - T_cone(1,n-1)/T_aw_cone(n-1)); % T-M constant for flat plate
    q_c_wedge(n-1) = C_wedge * rho_inf(n-1)^.5 * V_inf(n-1)^3.2;
    q_cone(1) = -(delta_y/lambda_N312)*(q_c_wedge(n-1)...
        - eps_N312*sig*T_cone(1,n-1)^4);
    q_cone(N) = -(delta_y/lambda_N312)* eps_N312*sig*T_cone(N,n-1)^4;
    for i = 2:N-1
        q_cone(i) = b_cone(i)*T_cone(i-1,n-1) + ...
            (1-b_cone(i)-b_cone(i+1))*T_cone(i,n-1) + b_cone(i+1)*T_cone(i+1,n-1);
    end
    A_nose_inv = inv(A_cone);
    T_cone(:,n) = A_nose_inv*q_cone;
end

%% plot temperature distribution throughout flightpath
figure()
hold on
p = zeros(1,N); % p array to specify legend items later
for m = 1:(round(N/10)):N
    if m == 1
        p(m) = plot(t_cone(1:round(length(t_cone)/k)), ...
             T_cone(m,1:round(length(t_cone)/k)),'--'); % plot front face
    else
        p(m) = plot(t_cone(1:round(length(t_cone)/k)), ...
            T_cone(m,1:round(length(t_cone)/k))); % plot middle layers
    end
end
p(N) = plot(t_cone(1:round(length(t_cone)/k)), ...
    T_cone(N,1:round(length(t_cone)/k)),'--'); % plot back face
p(2) = plot(t_cone(1:round(length(t_cone)/k)), ...
    zeros(1,round(length(t_cone)/k))+T_op_N312,'r'); % plot operating temp
p(3) = plot(t_cone(1:round(length(t_cone)/k)), ...
    zeros(1,round(length(t_cone)/k))+343,'k'); % plot max back face temp
xlabel('time (s)');
ylabel('temperature (K)');
title('Temperature throughout TPS (Nextel 312)');
legend([p(1),p(N),p(2),p(3)],'front face','back face','T_{op}','70{\circ}C', 'Location', 'best');

%% plot temperature distrubtion throughout TPS
y = linspace(0, L, N);
figure()
hold on
for j = 1:(round(timesteps/10)):timesteps/k
    plot(y, T_cone(:, j),'DisplayName',"t = " + (j-1)*delta_t + " s");
end
plot(y, T_cone(:, timesteps/k), 'DisplayName', "t = " + max(t_cone)/k + " s"); % plot final time that's being calculated
plot(y, zeros(1,N)+T_op_N312,'r--', 'DisplayName', 'T_{op}'); % operating temp
plot(y, zeros(1,N)+343,'k--', 'DisplayName', '70{\circ}C'); % max back face temp
xlabel('y (m)');
ylabel('temperature (K)');
title('Temperature through TPS thickness (Nextel 312)');
legend('show', 'Location', 'best');

%% plot incident convective heating
figure()
plot(t_nose, q_c_stag, t_cone, q_c_wedge)
xlim([0,max(t_cone)/2])
xlabel('time (s)');
ylabel('incident convective heating (W/m^2)');
title('Incident Convective Heating');
legend('Stagnation Point', 'Cone Midpoint');