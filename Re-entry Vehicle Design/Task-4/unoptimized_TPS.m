material = ["FW12", "R310", "Intek"];
rho = [2900, 800, 6.4];
cp = [1050, 1457, 1009];
T_op = [1700, 1650, 300];
eps = [0.87, 0.87, 0.87];
eps_f = [0.87, 0.87, 0.87];
eps_b = [0.87, 0.87, 0.87];
lambda = [2.73, 0.187, 0.046];
alpha = lambda./(rho.*cp);
DL = linspace(0.05, .01, 6);
VOL = 2*pi*0.272^2*(1-cosd(45))*DL;
T_max = zeros(length(material),length(DL));
masses = zeros(length(material),length(DL));
for i = 1:length(material)
    for j = 1:length(DL)
        masses(i,j) = rho(i) * VOL(j);
    end
end

for j= 1:length(material)
    for i = 1:length(DL)
        T_max(j,i) = TPS_stag_function(lambda(j), rho(j), cp(j), eps_f(j), eps_b(i), DL(i));
    end
end
