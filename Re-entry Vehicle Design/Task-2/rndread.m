function [fout,vout,nout]=rndread(filename)
% read stl file
fid=fopen(filename,'r');
vnum=0; %Vertex number counter.
report_num=0; %Report the status as we go.
fc=0;
while feof(fid)==0 %test for end of file, if not then do stuff
    tline=fgetl(fid); %reads a line of data from file.
    fword=sscanf(tline,'%s'); %make the line a character
    if strncmpi(fword,'f',1)==1 %Checking if a "F"eace line, as "F" is 1st char.
        fc=fc+1; %If a F we count the # of F's
        Norm=sscanf(tline,'%s %s %f %f %f');
        nor(:,fc)=Norm;
    end
    if strncmpi(fword,'v',1)==1 %Check in gif a "V"ertex line, as "V"is1stchar.
        vnum=vnum+1; %If a V we count the # of V's
        report_num=report_num+1; %Report a counter, so long files
        if report_num > 249 %Each 250 vertex print the current vertex number
            fprintf('Reading vertixnum: %d.\n', vnum);
            report_num=0;
        end
        v(:,vnum)=sscanf(tline,'%*s %f %f %f'); % & if a V, get the XYZ data of it.
    end
end
fnum=vnum/3; %Number of faces, vnum is number of vertices. STL is triangles.
flist=1:vnum; %Facelist of vertices, all in order.
F=reshape(flist,3,fnum); %Make a "3 by fnum" matrix of face list data.
%
%Return the faces and vertices.
%
fout=F';
vout=v';
nor(1:11,:)=[];
nout=nor';
%
fclose(fid);
end