function TPS_func = TPS_stag_function(lambdas, rhos, c_fs, eps_f, eps_b, dLs, N, timesteps)
%% Nose cone setup
sig = 5.6695e-8; % Stefan-Boltzmann constant [W/(m^2K^4)]

%% set up conditions with equal timesteps
t = evalin('base', 't');
t_nose = linspace(0, max(t), timesteps); % evenly spaced time vector [s]
V_1 = evalin('base', 'V_1');
rho_1 = evalin('base', 'rho_1');
T_aw = evalin('base', 'T_aw');
T_1 = evalin('base', 'T_1');
R_n = evalin('base', 'R_n');
V_inf = interp1(t, V_1, t_nose, 'spline'); % velocity at timesteps [m/s]
rho_inf = interp1(t, rho_1, t_nose, 'spline'); % density at timesteps [kg/m^3]
T_aw_nose = interp1(t, T_aw, t_nose, 'spline'); % velocity at timesteps [m/s]

%% create matrix & vectors for numerical solution
L = sum(dLs);
[lambda,alpha] = calc_lambdas(N, lambdas, c_fs, rhos, dLs, L);

delta_t = max(t_nose)/length(t_nose); % time step [s]
delta_y = L/N; % length step [m]
T_nose = zeros(N, length(t_nose)); % temp at all altitudes through TPS
T_nose(:, 1) = 342.99; % initial temperature = atmospheric
q_c_stag = zeros(length(t_nose),1);
q_nose = zeros(N, 1); % q vector for time n+1
[A_nose,b_nose] = calc_A(N, delta_t, delta_y, alpha);


for n = 2:timesteps % go through every time step
    C_stag = 1.83e-4 * R_n^(-.5) * (1 - T_nose(1,n-1)/T_aw_nose(n-1));
    q_c_stag(n-1) = C_stag * rho_inf(n-1)^.5 * V_inf(n-1)^3;
    q_nose(1) = -(delta_y/lambda(1))*(q_c_stag(n-1)...
        - eps_f*sig*T_nose(1,n-1)^4);
    q_nose(N) = -(delta_y/lambda(N))* eps_b*sig*T_nose(N,n-1)^4;
    for i = 2:N-1
        q_nose(i) = b_nose(i)*T_nose(i-1,n-1) + ...
            (1-b_nose(i)-b_nose(i+1))*T_nose(i,n-1) + b_nose(i+1)*T_nose(i+1,n-1);
    end
    A_nose_inv = inv(A_nose);
    T_nose(:,n) = A_nose_inv*q_nose;

end
assignin('base', 'delta_t', delta_t);
TPS_func = T_nose; 


%% Helper Functions

function [A_nose,b_nose] = calc_A(N, delta_t, delta_y, alpha)
    b_nose = zeros(N, 1); % b's that go into A matrix
    A_nose = zeros(N); % A matrix
    A_nose(1,1) = -1;
    A_nose(1,2) = 1;
    A_nose(N,N-1) = -1;
    A_nose(N,N) = 1;
    for i = 2:N
        b_nose(i) = 0.5*0.5*(alpha(i)+alpha(i-1))*delta_t/(delta_y^2);
    end
    for i = 2:N-1
        A_nose(i, i-1) = -b_nose(i);
        A_nose(i, i) = 1 + b_nose(i) + b_nose(i+1);
        A_nose(i, i+1) = -b_nose(i+1);
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
    end