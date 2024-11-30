from PIL import Image
from PIL import ImageChops

imgwhite = Image.open("C:\\Users\\natha\\baseball-card-app\\baseballscraper\\scripts\\white.jpg")
backs = []
with open("C:\\Users\\natha\\baseball-card-app\\baseballscraper\\scripts\\replace_backs_2.txt", "r") as readfile:
    content = readfile.readline()
    x = 0
    while(content != ""):
        back = content[:-1]
        backs.append(back)
        content = readfile.readline()
        x+=1
    readfile.close()


x = 0
while x <  len(backs):
    imgref = Image.open("C:\\Users\\natha\\baseball-card-app\\CardImages\\Fronts\\" + str(backs[x]) + ".jpg")
    height = imgref.height
    width = imgref.width
    newsize = (width, height)
    newback = imgwhite.resize(newsize)

    newback.save("C:\\Users\\natha\\baseball-card-app\\CardImages\\Replacements_round2\\Backs\\" + str(backs[x]) + ".jpg", subsampling =0, quality=100)
    x+=1