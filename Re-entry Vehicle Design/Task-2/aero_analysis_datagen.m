close all 
Cp = zeros(length(F), 1); % coefficient of pressure
Cnp = 0; % coefficient normal 
Cap = 0; % coefficient axial 
Np = 0;
Ap = 0;
My = 0;
S = zeros(length(F), 1);
r = 765; 
A = pi*r^2; 
alpha = 15; 
S_ref = A;
M_inf = 25;
gamma = 1.4;
num_points = length(M_inf);
Clp = zeros(num_points,1);
Cdp = zeros(num_points,1);
Cl_results = zeros(num_points, length(alpha));
Cd_results = zeros(num_points, length(alpha));

for i=1:length(M_inf)
    for j=1:length(alpha)
        Cp = calc_Cp(F, V, N, gamma, M_inf(i), alpha(j));
%          if (i == 3)
%             plot_Cp(Cp, F, V, M_inf(i), alpha(j))
%          end
%         [Np, Ap]= calc_forces(V, F, N, Cp);
%         
%         Cl_results(i,j) = calc_Clp(Np, Ap, S_ref, alpha(j));
%         Cd_results(i,j) = calc_Cdp(Np, Ap, S_ref, alpha(j));
    end
end


% figure()
% plot(M_inf,Cl_results(:,1))
% hold on 
% plot(M_inf,Cl_results(:,2))
% plot(M_inf,Cl_results(:,3))
% plot(M_inf,Cl_results(:,4))
% plot(M_inf,Cl_results(:,5))
% title("Lift Coefficient for Various Mach Numbers and Angles of Attack")
% xlabel("M_{inf}")
% ylabel("C_{l}")
% legend("\alpha = 0", "\alpha = 5", "\alpha=10", "\alpha=15","\alpha=20")

% figure()
% plot(M_inf,Cd_results(:,1))
% hold on 
% plot(M_inf,Cl_results(:,2))
% plot(M_inf,Cl_results(:,3))
% plot(M_inf,Cl_results(:,4))
% plot(M_inf,Cl_results(:,5))
% title("Drag Coefficient for Various Mach Numbers and Angles of Attack")
% xlabel("M_{inf}")
% ylabel("C_{d}")
% legend("\alpha = 0", "\alpha = 5", "\alpha=10", "\alpha=15","\alpha=20")




%%
% extract cp elements where V(:,2) = 0
cp_y0 = zeros(length(F),1);
val_x = zeros(length(F),1);
val_z = zeros(length(F),1);
for i = 1:length(F)
    if (abs(V(3*(i - 1) + 1, 2)) < 15 || abs(V(3*(i - 1) + 2, 2)) < 10 || abs(V(3*(i - 1) + 3, 2)) < 15)
        valx = mean([V(3*(i - 1) + 1, 1),  V(3*(i - 1) + 2, 1), V(3*(i - 1) + 3, 1)]);
        valz = mean([V(3*(i - 1) + 1, 3),  V(3*(i - 1) + 2, 3), V(3*(i - 1) + 3, 3)]);
        cp_y0(i) = Cp(i);
        val_x(i) = valx;
        val_z(i) = valz;
    end
end

val_ind = find(cp_y0);
val_x_final = zeros(length(val_ind),1);
val_z_final = zeros(length(val_ind),1);
cp_y0_final = zeros(length(val_ind),1);
for i = 1:length(val_ind)
    cp_y0_final(i) = cp_y0(val_ind(i));
    val_x_final(i) = val_x(val_ind(i));
    val_z_final(i) = val_z(val_ind(i));
end

% figure()
% plot(val_x_final,val_z_final,'*');
% title('y=0 slice for \alpha = 0');
% xlabel('x (mm)')
% ylabel('z (mm)')

figure()
x = 1:length(cp_y0_final);
plot(val_x_final, cp_y0_final, '*');
title('C_p vs. x');
xlabel('x (mm)')
ylabel('C_p')

%%

plot_Cp(Cp, F, V)



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
    Clp = (Cnp * cos(alpha)) - (Cap * sin(alpha));
end
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function Cdp = calc_Cdp(Np, Ap, S_ref, alpha)
    Cnp = calc_Cnp(Np, S_ref);
    Cap = calc_Cap(Ap, S_ref);
    Cdp = (Cnp * sin(alpha)) + (Cap * cos(alpha));
end
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function Cp = calc_Cp(F, V, N, gamma, M_inf, alpha)
    V_inf = 1000;
    counter = 0;
    Cp = zeros(length(F), 1);
    for i = 1: length(F)
    
        if (V(3*(i - 1) + 1, 3) < 1e-2 && V(3*(i - 1) + 2, 3) < 1e-2 && V(3*(i - 1) + 3, 3) < 1e-2)
           Cp(i) = -2/(gamma * M_inf);
           counter = counter + 1;
        
        else
            v_x = -V_inf*sind(alpha);
            v_z = -V_inf*cosd(alpha);
            v_y = 0;
            v = [v_x, v_y, v_z];
            st = (v.*(-N(i,:)))/V_inf;
            st = st(:,1) + st(:,2) + st(:,3);
            Cp(i) = (2/(gamma*M_inf^2))*((((gamma + 1)^2*M_inf^2)/(4*gamma*M_inf^2-2*(gamma -1)))^(gamma/(gamma - 1))*(1 + (2*gamma/(gamma + 1))*(M_inf^2 - 1)) - 1)*st^2;
        end
        
    end
end 
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function [Np, Ap]= calc_forces(V, F, N, Cp)
    Np = 0;
    Ap = 0;
    S = zeros(length(F), 1);
    for i = 1: length(F)
        p1 = V(3*(i - 1) + 1, :);
        p2 = V(3*(i - 1) + 2, :);
        p3 = V(3*(i - 1) + 3, :);
            
        AB = p1 - p2;
        AC = p1 - p3;
        S(i) = 0.5 * norm(cross(AB, AC));
        Np = Np + dot(N(i,:),[0,0,1]) * Cp(i) * S(i);
        Ap = Ap + dot(N(i,:),[1,0,0]) * Cp(i) * S(i);
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


