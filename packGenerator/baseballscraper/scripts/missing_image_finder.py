from PIL import Image
from PIL import ImageChops

x = 0
while x < 180639:
    try: 
        imgback = Image.open("C:\\Users\\natha\\baseball-card-app\\app_files\\baseball-card-app\\public\\CardImages\\Backs\\" + str(x) + ".jpg")
    except: 
        print("back: " + str(x))
    
    try:
        imgfront = Image.open("C:\\Users\\natha\\baseball-card-app\\app_files\\baseball-card-app\\public\\CardImages\\Fronts\\" + str(x) + ".jpg")
    except: 
        print("front: " + str(x))
    x+=1