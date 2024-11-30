function TPS_cone_func = TPS_cone_function(lambdas, rhos, c_fs, eps_f, eps_b, dLs, N, timesteps)
%% Wedge/Cone setup (Nextel 312)
V_1 = evalin('base', 'V_1');
rho_1 = evalin('base', 'rho_1');
T_aw_wedge = evalin('base', 'T_aw_wedge');
R_n = evalin('base', 'R_n');
t = evalin('base', 't');

sig = 5.6695e-8; % Stefan-Boltzmann constant [W/(m^2K^4)]
theta = 45; % cone angle [deg]
L_cone = (625e-3)/cosd(theta); % length of wedge side [m]
s_cone = 2*pi*R_n*(theta/360) + L_cone/2; % curvilinear coord of wedge midpoint [m]

%% set up conditions with equal timesteps

t_cone = linspace(0, max(t), timesteps); % evenly spaced time vector [s]
V_inf = interp1(t, V_1, t_cone, 'spline'); % velocity at timesteps [m/s]
rho_inf = interp1(t, rho_1, t_cone, 'spline'); % density at timesteps [kg/m^3]
T_aw_cone = interp1(t, T_aw_wedge, t_cone, 'spline'); % velocity at timesteps [m/s]

%% create matrix & vectors for numerical solution
L = sum(dLs);
[lambda,alpha] = calc_lambdas(N, lambdas, c_fs, rhos, dLs, L);

delta_t = max(t_cone)/length(t_cone); % time step [s]
delta_y = L/N; % length step [m]
T_cone = zeros(N, length(t_cone)); % temp at all altitudes through TPS
T_cone(:, 1) = 342.99; %T_1(1); % initial temperature = atmospheric [K]
q_c_wedge = zeros(length(t_cone),1);
q_cone = zeros(N, 1); % q vector for time n+1

[A_cone,b_cone] = calc_A(N, delta_t, delta_y, alpha);

for n = 2:timesteps % go through time steps
    C_wedge = 4.03e-5*((cosd(theta))^0.5)*sind(theta)*s_cone^(-0.5)*...
        (1 - T_cone(1,n-1)/T_aw_cone(n-1)); % T-M constant for flat plate
    q_c_wedge(n-1) = C_wedge * rho_inf(n-1)^.5 * V_inf(n-1)^3.2;
    q_cone(1) = -(delta_y/lambda(1))*(q_c_wedge(n-1)...
        - eps_f*sig*T_cone(1,n-1)^4);
    q_cone(N) = -(delta_y/lambda(N))* eps_b*sig*T_cone(N,n-1)^4;
    for i = 2:N-1
        q_cone(i) = b_cone(i)*T_cone(i-1,n-1) + ...
            (1-b_cone(i)-b_cone(i+1))*T_cone(i,n-1) + b_cone(i+1)*T_cone(i+1,n-1);
    end
    A_nose_inv = inv(A_cone);
    T_cone(:,n) = A_nose_inv*q_cone;
end
assignin('base', 'delta_t', delta_t);
TPS_cone_func = T_cone;

%% Helper Functions

function [A_cone,b_cone] = calc_A(N, delta_t, delta_y, alpha)
    b_cone = zeros(N, 1); % b's that go into A matrix
    A_cone = zeros(N); % A matrix
    A_cone(1,1) = -1;
    A_cone(1,2) = 1;
    A_cone(N,N-1) = -1;
    A_cone(N,N) = 1;
    for i = 2:N
        b_cone(i) = 0.5*0.5*(alpha(i)+alpha(i-1))*delta_t/(delta_y^2);
    end
    for i = 2:N-1
        A_cone(i, i-1) = -b_cone(i);
        A_cone(i, i) = 1 + b_cone(i) + b_cone(i+1);
        A_cone(i, i+1) = -b_cone(i+1);
    end

function [lambda,alpha] = calc_lambdas(N, lambdas, c_fs, rhos, dLs, L)
    index_0 = 1;
    index_1 = 1;
    lambda = zeros(N,1);
    c_f = zeros(N,1);
    rho = zeros(N,1);
    alpha = zeros(N,1);
    for i = 1:length(lambdas)
        index_1 = index_1 + round((N-1)*((dLs(i)/L)));
        if i == length(lambdas)
            index_1 = N;
        end
        lambda(index_0:index_1) = lambdas(i)*ones(index_1 - index_0 + 1,1); 
        c_f(index_0:index_1) = c_fs(i)*ones(index_1 - index_0 + 1,1); 
        rho(index_0:index_1) = rhos(i)*ones(index_1 - index_0 + 1,1);
        alpha(index_0:index_1) = lambda(index_0:index_1)./(rho(index_0:index_1).*c_f(index_0:index_1)); % thermal diffusivity [m^2/s
        index_0 = index_1 + 1;
        if i~= length(lambdas)
            lambda(index_1) = (lambdas(i) + lambdas(i+1))/2;
            rho(index_1) = (rhos(i) + rhos(i+1))/2;
            c_f(index_1) = (c_f(i) + c_f(i+1))/2;
            alpha(index_1) = (alpha(i) + alpha(i+1))/2;
        end
%         disp(index_1)
    end