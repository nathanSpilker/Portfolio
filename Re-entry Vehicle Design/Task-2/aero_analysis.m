close all 
if exist("N", 'var') == 0 || exist("V", 'var') == 0 || exist("F", 'var') == 0
    [F,V,N]= rndread("CAD_files/CAD_capsule_3.stl");
end 

Cp = zeros(length(N), 1); % coefficient of pressure
Cnp = 0; % coefficient normal 
Cap = 0; % coefficient axial 
Np = 0;
Ap = 0;
My = 0;
S = zeros(length(N), 1);
len_trim_V = length(V)/2;
len_trim_F = length(F)/2;
len_trim_N = length(N)/2;
V_2_trim = V(1:len_trim_V,:);
N_2_trim = N(1:len_trim_N,:);
F_2_trim = F(1:len_trim_F,:);
cg_x = 0;
cg_z = 0;


r = 765; 
A = pi*r^2; 
alpha = [0,5,10,20]; 
S_ref = A;
L_ref = 765*0.43*2;
M_inf = [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
gamma = 1.4;
num_points = length(M_inf);
Clp = zeros(num_points,1);
Cdp = zeros(num_points,1);
Cl_results = zeros(num_points, length(alpha));
Cd_results = zeros(num_points, length(alpha));
Cm_results = zeros(num_points, length(alpha));
aero_db = zeros(num_points*length(alpha), 5);
for i=1:length(M_inf)
    for j=1:length(alpha)   
        aero_db(((i-1)*length(alpha))+j,1) = M_inf(i);
        aero_db(((i-1)*length(alpha))+j,2) = alpha(j);
        Cp = calc_Cp(V_2_trim, N_2_trim, gamma, M_inf(i), alpha(j));
        [Np, Ap]= calc_forces(V_2_trim, N_2_trim, Cp);
        M = calc_moment(V_2_trim, N_2_trim, Cp, cg_x, cg_z);
        Cl_results(i,j) = calc_Clp(Np, Ap, S_ref, alpha(j));
        Cd_results(i,j) = calc_Cdp(Np, Ap, S_ref, alpha(j));
        Cm_results(i,j) = calc_Cm(M, S_ref, L_ref);
        aero_db(((i-1)*length(alpha))+j,3) = round(Cl_results(i,j),4);
        aero_db(((i-1)*length(alpha))+j,4) = round(Cd_results(i,j),4);
        aero_db(((i-1)*length(alpha))+j,5) = round(Cm_results(i,j),4);
    end
end

headers = {'Mach #', 'AOA', 'C_L', 'C_D', 'C_M'};
db_final = [headers;num2cell(aero_db)];
disp(db_final);

figure()
plot(M_inf,Cl_results(:,1))
hold
plot(M_inf,Cl_results(:,2))
plot(M_inf,Cl_results(:,3))
plot(M_inf,Cl_results(:,4))
title("Lift Coefficient for Various Mach Numbers and Angles of Attack")
xlabel("M_{inf}")
ylabel("C_{l}")

figure()
plot(M_inf,Cd_results(:,1))
hold
plot(M_inf,Cd_results(:,2))
plot(M_inf,Cd_results(:,3))
plot(M_inf,Cd_results(:,4))
title("Drag Coefficient for Various Mach Numbers and Angles of Attack")
legend("\alpha = 0", "\alpha = 5", "\alpha = 10", "\alpha = 20")
xlabel("M_{inf}")
ylabel("C_{d}")

figure()
plot(M_inf,Cm_results(:,1))
hold
plot(M_inf,Cm_results(:,2))
plot(M_inf,Cm_results(:,3))
plot(M_inf,Cm_results(:,4))
title("Pitch Coefficient for Various Mach Numbers and Angles of Attack")
legend("\alpha = 0", "\alpha = 5", "\alpha = 10", "\alpha = 20")
xlabel("M_{inf}")
ylabel("C_{m}")

area_cone = area - S_ref;
%% Helper Functions


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function Cnp = calc_Cnp(Np, S_ref)
    Cnp = Np/(S_ref);
end
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function Cap = calc_Cap(Ap, S_ref)
    Cap = Ap/(S_ref);
end
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function Clp = calc_Clp(Np, Ap, S_ref, alpha)
    Cnp = calc_Cnp(Np, S_ref);
    Cap = calc_Cap(Ap, S_ref);
    Clp = ((Cnp * cosd(alpha)) - (Cap * sind(alpha)));
end
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function Cm = calc_Cm(M, S_ref, L_ref)
    Cm = (M)/(S_ref * L_ref);
end
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function Cdp = calc_Cdp(Np, Ap, S_ref, alpha)
    Cnp = calc_Cnp(Np, S_ref);
    Cap = calc_Cap(Ap, S_ref);
    Cdp = (Cnp * sind(alpha)) + (Cap * cosd(alpha));
end
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function Cp = calc_Cp(V, N, gamma, M_inf, alpha)
    V_inf = 1;
    Cp = zeros(length(N), 1);
    for i = 1: length(N)
        if (V(3*(i - 1) + 1, 3) < 1e-3 && V(3*(i - 1) + 2, 3) < 1e-3 && V(3*(i - 1) + 3, 3) < 1e-3)
            Cp(i) = -2/(gamma * M_inf^2);
        else
            v_x = V_inf*sind(alpha);
            v_z = -V_inf*cosd(alpha);
            v_y = 0;
            v = [v_x, v_y, v_z];
            st = (v.*(N(i,:)))/V_inf;
            st = st(:,1) + st(:,2) + st(:,3);
            Cp(i) = (2/(gamma*M_inf^2))*((((gamma + 1)^2*M_inf^2)/(4*gamma*M_inf^2-2*(gamma -1)))^(gamma/(gamma - 1))*(1 + (2*gamma/(gamma + 1))*(M_inf^2 - 1)) - 1)*st^2;
        end
        
    end
end 
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function [Np, Ap]= calc_forces(V, N, Cp)
    Np = 0;
    Ap = 0;
    sum = 0;
    S = zeros(length(N), 1);
    for i = 1: length(N)
        p1 = V(3*(i - 1) + 1, :);
        p2 = V(3*(i - 1) + 2, :);
        p3 = V(3*(i - 1) + 3, :);
        AB = p1 - p2;
        AC = p1 - p3;
        S(i) = 0.5*norm(cross(AB, AC));
        sum = sum + S(i);
        Np = Np - dot(N(i,:),[1,0,0]) * Cp(i) * S(i);
        Ap = Ap - dot(N(i,:),[0,0,-1]) * Cp(i) * S(i); 
        
    end 
    assignin('base', 'area', sum)
    assignin('base', 'Np', Np)
    assignin('base', 'Ap', Ap)
    assignin('base', 'S', S)
end

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function M = calc_moment(V, N, Cp, cg_x, cg_z)
    M = 0;
    S = zeros(length(N), 1);
    for i = 1: length(N)
        p1 = V(3*(i - 1) + 1, :);
        p2 = V(3*(i - 1) + 2, :);
        p3 = V(3*(i - 1) + 3, :);
        AB = p1 - p2;
        AC = p1 - p3;
        S(i) = 0.5*norm(cross(AB, AC));
        center_x = (p1(1)+p2(1)+p3(1))/3;
        center_z = (p1(3)+p2(3)+p3(3))/3;
        M = M + (((center_x-cg_x) * dot(N(i,:),[0,0,-1]))...
            + ((center_z-cg_z) * dot(N(i,:),[1,0,0]))*Cp(i)*S(i));
    end 
end
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function plot_Cp(Cp, F, V, mach, alpha)
    title_name = "Pressure Coefficient, Mach %d, alpha = %d deg";
    title_name = sprintf(title_name, mach, alpha);
    Cp_v = repelem(Cp, 3);
    figure()
    trisurf(F, V(:,1), V(:,2), V(:,3), Cp_v);
    xlabel("mm")
    ylabel("mm")
    zlabel("mm")
    grid on
    shading flat
    axis equal
    colorbar
    title(title_name)
    hold off
end 

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%





