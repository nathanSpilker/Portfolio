%% Parameters
% reference length, area, radius (m, m2)
dref = 1.321;
sref = 0.00203;
r = 0.0508;

% initial and final masses and cgs (kg, m)
mi = 8.69 / 2.2;
mf = 1.1826;
cgi = 0.5;
cgf = 0.5;

% burn time (s)
tburn = 27.55;

% nozzle exit area (m2)
Aex = 0.000285;

% Isp, height measured at (s, m)
Isp = 245;
href = 10000;

% Initial and final moments of inertia
Ii = [(1/2)*mi*r^2 0 0; 0 (1/12)*mi*dref^2 0; 0 0 (1/12)*mi*dref^2];
If = [(1/2)*mf*r^2 0 0; 0 (1/12)*mf*dref^2 0; 0 0 (1/12)*mf*dref^2];

g0 = -9.8;
mdot = (mf - mi)/tburn;
tp = Isp*mdot*g0;
[~, ~, Pref, ~] = atmoscoesa(href);
Altitude_t = [0,5000,10000,20000,30000,60000,100000,150000,200000];
Thrusts = [];

for i = 1:length(Altitude_t)
    [~, ~, Pa, rho] = atmoscoesa(min(Altitude_t(i), 84850));
    T = tp + Aex*(Pref-Pa);
    Thrusts(i,:) = [Altitude_t(i), T];
end

Thrusts = Thrusts(:,2);