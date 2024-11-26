import numpy as np
import json

codes = {}

for i in range(100):
    code = np.random.rand(13)
    codes[str(i)] = code.tolist()
    print("[" + str("{:.2f}".format(code[0])) + "," + str("{:.2f}".format(code[1])) + "," + str("{:.2f}".format(code[2])) + "," + str("{:.2f}".format(code[3])) + "," + str("{:.2f}".format(0)) + "," + str("{:.2f}".format(code[5])) + "," + str("{:.2f}".format(code[6])) + "," + str("{:.2f}".format(code[7])) + "," + str("{:.2f}".format(code[8])) + "," + str("{:.2f}".format(code[9])) + "," + str("{:.2f}".format(code[10])) + "," + str("{:.2f}".format(code[11])) + "," + str("{:.2f}".format(code[12])) + "],")


# with open("avatarCodes.json", "w") as outfile: 
#     json.dump(codes, outfile)