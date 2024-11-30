from PIL import Image
from PIL import ImageChops

imgref = Image.open("C:\\Users\\natha\\baseball-card-app\\baseballscraper\\scripts\\nobackimage_2.jpg")

x = 0
while x <  200000:
    imgback = Image.open("C:\\Users\\natha\\baseball-card-app\\CardImages\\Backs\\" + str(x) + ".jpg")
    if (imgback.width != 250):
        x+=1
        continue

    if (imgback.height != 350):
        x+=1
        continue
    
    diff = ImageChops.difference(imgref.convert('RGB'), imgback.convert('RGB'))
    if diff.getbbox(): 
        x+=1
        continue
    else: 
        with open("C:\\Users\\natha\\baseball-card-app\\baseballscraper\\scripts\\replace_backs_2.txt", "a") as writefile:
            writefile.write(str(x))
            writefile.write("\n")
        x+=1