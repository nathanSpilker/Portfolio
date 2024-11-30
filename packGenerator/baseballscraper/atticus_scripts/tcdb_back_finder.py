from PIL import Image
from PIL import ImageChops
import os

imgref2 = Image.open(os.path.join(os.path.dirname(__file__), "nobackimage_2.jpg"))
imgref1 = Image.open(os.path.join(os.path.dirname(__file__), "nobackimage.jpg"))

x = 179883
while x <  234011:
    imgback = Image.open(os.path.join(os.path.dirname(__file__), "..", "..", "..", "CardImages", "Backs", str(x) + ".jpg"))

    if (imgback.width != 250):
        x+=1
        continue

    if (imgback.height != 350):
        x+=1
        continue
    
    diff1 = ImageChops.difference(imgref1.convert('RGB'), imgback.convert('RGB'))
    diff2 = ImageChops.difference(imgref2.convert('RGB'), imgback.convert('RGB'))

    if diff2.getbbox(): 
        x+=1
        continue

    else: 
        with open(os.path.join(os.path.dirname(__file__), "backreplacements_3.txt"), "a") as writefile:
            print(x)
            writefile.write(str(x))
            writefile.write("\n")
        x+=1