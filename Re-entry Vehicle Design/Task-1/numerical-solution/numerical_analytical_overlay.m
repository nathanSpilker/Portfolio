%% NOTE THAT YOU HAVE TO RUN task1_analytical.m AND numerical_trajectory_calculator.m TO GET THE DATA
%% overlay velocities
figure();
plot(v_a(:,1), z_a*1000, Vs(:,1), linspace(H,0, 12001));
title('Velocity Profile');
xlabel('Velocity (m/s)');
ylabel('Altitude (m)');
legend('Analytical', 'Numerical');

%% overlay dynamic pressure
figure();
plot(q_a(:,1), z_a*1000, qbars(:,1), linspace(H,0, 12000));
title('Dynamic Pressure');
xlabel('Dynamic Pressure (Pa)');
ylabel('Altitude (m)');
legend('Analytical', 'Numerical');

%% overlay Mach number
figure();
plot(M_a(:,1), z_a*1000, machs(:,1), linspace(H,0, 12000));
title('Mach Number');
xlabel('Mach Number');
ylabel('Altitude (m)');
legend('Analytical', 'Numerical');