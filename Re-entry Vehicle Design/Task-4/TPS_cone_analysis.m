%% Runs Stag Temperature Distribution for Multiple TPS Layers 
close all
addpath("helper functions")

cps= [1046.7, 700,1150,  1046.7];
lambdas = [0.15, 0.055, 0.02, 0.15];
Top_cone = [1800, 1000, 650, 1800] + 273;
rhos = [2700, 92, 112, 2700];

eps_f = 0.88;
eps_b = 0.88;
dLs  = [.00025, 0.013, 0.03, 0.00025];
N = 600 + 1; % y grid dimension []
timesteps = 600;
T_cone = TPS_cone_function(lambdas, rhos, cps, eps_f, eps_b, dLs, N, timesteps);
Tmax_cone = 70 + 273;

%% plot temperature distrubtion throughout TPS
timesteps = length(T_cone(1,:));
delta_t =  max(t)/timesteps;
L = sum(dLs);
y = linspace(0, L, N);
t_nose = linspace(0, max(t), timesteps);
figure()
hold on
for j = 1:(round(timesteps/10)):timesteps
    plot(y, T_cone(:, j),'DisplayName',"t = " + (j-1)*delta_t + " s");
end
plot(y, T_cone(:, timesteps), 'DisplayName', "t = " + max(t) + " s"); % plot final time that's being calculated
xlabel('Y(m)');
ylabel('Temperature (K)');
title('Temperature through Optimized Flexible Nose TPS Thickness');
legend('show');

%% plot temperature distribution throughout flightpath
figure()
hold on
period = (timesteps);
p = zeros(1,N); % p array to specify legend items later
for m = 1:(round(N/10)):N
    if m == 1
        p(m) = plot(t_nose(1:period), ...
             T_cone(m,1:period),'--'); % plot front face
    else
        p(m) = plot(t_nose(1:period), ...
            T_cone(m,1:period)); % plot middle layers
    end
end
p(N) = plot(t_nose(1:period), ...
    T_cone(N,1:period),'--'); % plot back face
xlabel('Time (s)');
ylabel('Temperature (K)');
xlim([0,period*delta_t])
title('Temperature throughout Optimized Flexible Cone TPS');
legend([p(1) p(N)],'front face','back face');

%% plot temperature distribution with front face of
figure()
hold on
period = (timesteps);
p = zeros(1,N); % p array to specify legend items later
p(1) = plot(t_nose(1:period), ...
             T_cone(1, 1:period), 'k'); % plot front face

p(2) = plot(t_nose(1:period), ...
            T_cone(round(N*dLs(1)/L),1:period), 'r'); % plot middle layers

p(3) = plot(t_nose(1:period), ...
            T_cone(round(N*(dLs(2)+dLs(1))/L),1:period), 'b'); % plot middle layers

p(N) = plot(t_nose(1:period), ...
    T_cone(N,1:period), 'm'); % plot back face


plot(t_nose(1:period), linspace(Top_cone(1), Top_cone(1), period), 'k--')
plot(t_nose(1:period), linspace(Top_cone(2), Top_cone(2), period), 'r--')
plot(t_nose(1:period), linspace(Top_cone(3), Top_cone(3), period), 'b--')
plot(t_nose(1:period), linspace(Tmax_cone, Tmax_cone, period), 'm--')
xlabel('Time (s)');
ylabel('Temperature (K)');
xlim([0,period*delta_t])
title('Temperature Throughout Optimized Flexible Cone TPS');
legend('Front face Nextel', 'Front face Sigratherm', 'Front face Pyrogel','Back face');