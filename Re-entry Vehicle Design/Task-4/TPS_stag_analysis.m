%% Runs Stag Temperature Distribution for Multiple TPS Layers 
close all
addpath("helper functions")


cps = [1050, 1457, 1009, 1050];
lambdas = [2.73, 0.187, 0.046, 0.187];
eps_f = 0.87;
eps_b = 0.87;
dLs = [0.003, 0.04, 0.025, 0.002];
rhos = [2900, 800, 6.4, 2900];
Top_nose = [1700, 1650, 300, 1700] + 273;
Tmax_nose = 70 + 273;

N = 500 + 1; % y grid dimension []
timesteps = 500;
T_nose = TPS_stag_function(lambdas, rhos, cps, eps_f, eps_b, dLs, N, timesteps);


%% plot temperature distrubtion throughout TPS
timesteps = length(T_nose(1,:));
delta_t =  max(t)/timesteps;
L = sum(dLs);
y = linspace(0, L, N);
t_nose = linspace(0, max(t), timesteps);
figure()
hold on
for j = 1:(round(timesteps/10)):timesteps
    plot(y, T_nose(:, j),'DisplayName',"t = " + (j-1)*delta_t + " s");
end
plot(y, T_nose(:, timesteps), 'DisplayName', "t = " + max(t) + " s"); % plot final time that's being calculated
xlabel('Y(m)');
ylabel('Temperature (K)');
title('Temperature through Optimized Rigid Nose TPS Thickness');
legend('show');

%% plot temperature distribution throughout flightpath
figure()
hold on
period = (timesteps);
p = zeros(1,N); % p array to specify legend items later
for m = 1:(round(N/10)):N
    if m == 1
        p(m) = plot(t_nose(1:period), ...
             T_nose(m,1:period),'--'); % plot front face
    else
        p(m) = plot(t_nose(1:period), ...
            T_nose(m,1:period)); % plot middle layers
    end
end
p(N) = plot(t_nose(1:period), ...
    T_nose(N,1:period),'--'); % plot back face
xlabel('Time (s)');
ylabel('Temperature (K)');
xlim([0,period*delta_t])
title('Temperature throughout Optimized Rigid Nose TPS');
legend([p(1) p(N)],'front face','back face');


%% plot temperature distribution with front face of
figure()
hold on
period = (timesteps);
p = zeros(1,N); % p array to specify legend items later
p(1) = plot(t_nose(1:period), ...
             T_nose(1, 1:period), 'k'); % plot front face

p(2) = plot(t_nose(1:period), ...
            T_nose(round(N*dLs(1)/L),1:period), 'r'); % plot middle layers

p(3) = plot(t_nose(1:period), ...
            T_nose(round(N*(dLs(2)+dLs(1))/L),1:period), 'b'); % plot middle layers

p(N) = plot(t_nose(1:period), ...
    T_nose(N,1:period), 'm'); % plot back face


plot(t_nose(1:period), linspace(Top_nose(1), Top_nose(1), period), 'k--')
plot(t_nose(1:period), linspace(Top_nose(2), Top_nose(2), period), 'r--')
plot(t_nose(1:period), linspace(Top_nose(3), Top_nose(3), period), 'b--')
plot(t_nose(1:period), linspace(Tmax_nose, Tmax_nose, period), 'm--')
xlabel('Time (s)');
ylabel('Temperature (K)');
xlim([0,period*delta_t])
title('Temperature Throughout Optimized Rigid Nose TPS');
legend('Front face FW12', 'Front face RESCOR', 'Front face INTEK FOAM','Back face FW12');