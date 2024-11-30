from PIL import Image
from PIL import ImageChops
import os

imgwhite = Image.open(os.path.join(os.path.dirname(__file__), "white.jpg"))
backs = []
with open(os.path.join(os.path.dirname(__file__), "backreplacements_3.txt"), "r") as readfile:
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
    imgref = Image.open(os.path.join(os.path.dirname(__file__), "..", "..", "..", "CardImages", "Fronts", str(backs[x]) + ".jpg"))
    height = imgref.height
    width = imgref.width
    newsize = (width, height)
    newback = imgwhite.resize(newsize)

    newback.save(os.path.join(os.path.dirname(__file__), "Backs", str(backs[x]) + ".jpg"), subsampling =0, quality=100)
    x+=1