
function stl2mat
[dir,dir_stl]=uigetfile('*.stl',['Select the stl file relative to the part to be analyzed']); %Select input directory (UI)

out_folder=uigetdir(['Select the directory where to store the files F,V e dN']); %Select out put directory (U I)

[F,V,N]=rndread([dir_stl,dir]);
writematrix(F,[out_folder,'/F.txt'],'Delimiter',' ');
writematrix(V,[out_folder,'/V.txt'],'Delimiter',' ');
writematrix(N,[out_folder,'/N.txt'],'Delimiter',' ');
end