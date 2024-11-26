from PIL import Image
import os
from python_algorithms import *
import time
import requests
import json

try:
    candidate = Image.open(os.path.join(os.path.dirname(__file__), "candidate.jpg"))
except:
    candidate = Image.open(os.path.join(os.path.dirname(__file__), "candidate.png"))
    candidate = candidate.convert('RGB')

#padding function
def add_margin(pil_img, top, right, bottom, left, color):
    width, height = pil_img.size
    new_width = width + right + left
    new_height = height + top + bottom
    result = Image.new(pil_img.mode, (new_width, new_height), color)
    result.paste(pil_img, (left, top))
    return result

#function to check if row col is white 
def check_white(row, col):
    pixel = padded_candidate.getpixel((col, row))
    if (pixel[0] > 230) and (pixel[1] > 230) and (pixel[2] > 230):
        return True

def recursive_check():
    row = checks[0][0]
    col = checks[0][1]
    # print("(" + str(row) + ", " + str(col) + ")")
    # print(check_white(0,0))
    if check_white(row, col):
        connectivity[row][col] = 1
        if row < height - 1:
            if connectivity[row + 1][col] != 1 and connectivity[row + 1][col] != 0 and connectivity[row + 1][col] != 2:
                checks.append((row + 1, col))
                connectivity[row + 1][col] = 2
        if col < width - 1:
            if connectivity[row][col + 1] != 1 and connectivity[row][col + 1] != 0 and connectivity[row][col + 1] != 2:
                checks.append((row, col + 1))
                connectivity[row][col + 1] = 2
        if col > 0:
            if connectivity[row][col - 1] != 1 and connectivity[row][col - 1] != 0 and connectivity[row][col - 1] != 2:
                checks.append((row, col - 1))
                connectivity[row][col - 1] = 2
        if row > 0:
            if connectivity[row - 1][col] != 1 and connectivity[row - 1][col] != 0 and connectivity[row - 1][col] != 2:
                checks.append((row - 1, col))
                connectivity[row - 1][col] = 2
    else:
        connectivity[row][col] = 0
        zeros.append((row,col))
    del checks[0]

def close_to_edge(row, col, dist):
    for coord in zeros:
        if (dist_to(row, col, coord[0], coord[1]) < dist):
            return True
    return False

def dist_to(row1, col1, row2, col2):
    dr = abs(row2 - row1)
    dc = abs(col2 - col1)
    return (dr**2 + dc**2)**(0.5)

basewidth = 350
wpercent = (basewidth/float(candidate.size[0]))
hsize = int((float(candidate.size[1])*float(wpercent)))
candidate = candidate.resize((basewidth,hsize), Image.ANTIALIAS)

padded_candidate = add_margin(candidate, 10, 10, 10, 10, (255,255,255))
width = padded_candidate.width
height = padded_candidate.height

connectivity = [ [ 0.5 for i in range(width) ] for j in range(height) ]
checks = []
zeros = []
checks.append((0,0))

start = time.time()

while len(checks) > 0:
    recursive_check()

for row in range(height):
    for col in range(width):
        # print("(" + str(row) + ", " + str(col) + ")")
        if(connectivity[row][col] == 1): 
            if (close_to_edge(row, col, 6)):
                padded_candidate.putpixel((col, row), (0, 0, 0))
        else:
            padded_candidate.putpixel((col, row), (255, 255, 255))

basewidth = 450
wpercent = (basewidth/float(padded_candidate.size[0]))
hsize = int((float(padded_candidate.size[1])*float(wpercent)))
padded_candidate = padded_candidate.resize((basewidth,hsize), Image.ANTIALIAS)

padded_candidate.save(os.path.join(os.path.dirname(__file__), "finished_prod.jpg"))

# end = time.time()
# print(end - start)

# tries at request to convertio
# r = requests.post(" http://api.convertio.co/convert", data = '{"apikey": "35fe04ebd982cd807555727da6f9fff7", "file":"candidate_fixed_maybe.jpg", "outputformat":"png", "input": "upload"}')
# req = json.loads(r.text)
# print(r.text)
# id_ = req["data"]["id"]
# with open("candidate_fixed_maybe.jpg", 'rb') as f:
#     r = requests.put(" http://api.convertio.co/convert/" + id_ + "/candidate_fixed_maybe.jpg", files = {'file': f})

# print(r.text)

# id_ = "0e402d9e0e2002f17ac2dda79a487250"
# get = requests.get("http://api.convertio.co/convert/" + id_ + "/status")
# print(get.text)



# get.save("obtainment.svg")
# f = open("finished_prod.svg")
# r = requests.post("http://svg2stl.com/api/upload", data = {"file": "svg", "name": "finished_prod.svg"}, files={"svg": f})
# print(r.text)