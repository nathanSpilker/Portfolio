%% Script for Processing and Rendering STL file 

[F,V,N]= rndread("CAD_capsule_3.stl");
trimesh(F, V(:,1), V(:,2), V(:,3));
xlabel("V(:,1)")
ylabel("V(:,2)")
zlabel("V(:,3)")
xlim([-765,765])
ylim([-765, 765])


