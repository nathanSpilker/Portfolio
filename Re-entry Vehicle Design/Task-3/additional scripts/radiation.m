%% set constants
emissivity = 0.88; % approximate emissivity for ceramic []
sigma = 5.6695e-8; % Stefan-Boltzmann constant [W/m^2K^4]
% q_w_c = previously calculated incident convective heating

%% calculate radiated heating at stagnation - is this needed?
% note v_inf < 7.62 km/s
% rn = 2.72;
% v_inf = 6.3495e3;
% rho_inf = 0.0182;
% q_w_R = JSL(rn, v_inf, rho_inf)*1e4; % radiated heating at stagnation [W/m^2]

%% solve for wall temperature - TM
A_q = 1.83e-4 * R_n^(-1/2) .* rho_1.^1/2 .* V_1.^3; % check units!
B_q = A_q*c_p./h_aw;
T_w = zeros(length(z),1);
T_w(1) = T_1(1); % initial wall temp
for i = 1:length(T_w)-1
    T_w(i+1) = ((A_q(i)/(emissivity*sigma))/...
        (1+B_q(i)/(emissivity*sigma*T_w(i)^3)))^(1/4);
end

% Newton Raphson method
T_w_NR = zeros(length(z),1);
T_w_NR(1) = T_1(1); % initial wall temp
eps_sig = emissivity*sigma;
for i = 1:length(T_w_NR)-1
    T_w_NR(i+1) = T_w_NR(i) - ((4*T_w_NR(i)^3 + B_q(i)/eps_sig)^(-1))*...
        (T_w_NR(i)^4 + B_q(i)*T_w_NR(i)/eps_sig - A_q(i)/eps_sig);
end

%% DKR version
G = 6.67e-11;
M_earth = 5.972e24;
R_earth = 6371e3;
V_co = sqrt(G*M_earth/(R_earth+z(1)));
H_te = c_p*T_e + (V_1.^2)/2;
A_q_DKR = 1.1e8*R_n^(-0.5)*(rho_1/rho_1(end)).^(0.5).*(V_1/V_co).^3.15;
B_q_DKR = A_q_DKR*c_p./H_te;

T_w_DKR = zeros(length(z),1);
T_w_DKR(1) = T_1(1); % initial wall temp
eps_sig = emissivity*sigma;
for i = 1:length(T_w_DKR)-1
    T_w_DKR(i+1) = T_w_DKR(i) - ((4*T_w_DKR(i)^3 + B_q_DKR(i)/eps_sig)^(-1))*...
        (T_w_DKR(i)^4 + B_q_DKR(i)*T_w_DKR(i)/eps_sig - A_q_DKR(i)/eps_sig);
end

plot(T_w,z,T_w_NR,z,T_w_DKR,z);
legend('simple', 'Newton Raphson', 'DKR')
xlabel('T_w (K)')
ylabel('Altitude (m)')



%% function for stagnation radiative heating
% function q_stag_R = JSL(rn, v_inf, rho_inf) % Johnson, Starkey, & Lewis
% K1 = 372.6;
% K2 = 8.5;
% K3 = 1.6;
% rho_sl = 1.225; % density at sea level [kg/m^3]
% q_stag_R = rn*K1*(3.28084e-4*v_inf)^K2*(rho_inf/rho_sl)^K3;
% end