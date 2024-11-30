import json

cards = []
rawdata = []

with open("C:\\Users\\natha\\baseball-card-app\\CardImages\\CardsList.txt", "r") as readfile:
    content = readfile.readline()
    x = 0
    while(content != ""):
        rawdata.append(content)
        content = readfile.readline()
        x+=1

x = 0
while(x < len(rawdata)):
    rd = rawdata[x].split("\t")
    while (int(rd[0]) < len(cards)):
        cards.pop()
    cards.append(rawdata[x])
    x+=1
print(len(cards))

with open("C:\\Users\\natha\\baseball-card-app\\CardImages\\CardsListDynamic.txt", "w") as writefile:
    x = 0
    while(x<len(cards)):
        writefile.write(cards[x])
        x+=1
    