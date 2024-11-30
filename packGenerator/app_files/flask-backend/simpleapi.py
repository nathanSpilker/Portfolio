from random import randint
import math
import flask
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from flask import request
import os
from fuzzywuzzy import process
import time

app = flask.Flask("__main__")
CORS(app)
cors = CORS(app, resources={
    r"/*": {
        "origins": "*"
    }
})
app.config['CORS_HEADERS'] = "Content-Type"
client = MongoClient("mongodb+srv://natha:!Njspilk99!@cluster0.dycxv.mongodb.net/test?authSource=admin&replicaSet=atlas-brti5i-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true")

db = client.AttiCrypto
LoggedCards = db.LoggedCards
Accounts = db.Accounts
CardGuard = db.CardGuard

dir = os.path.dirname(__file__)
readfile = open(os.path.join(dir, "Cards_dupsremoved.txt"),"r")

cards = []

content = readfile.readline()
x = 0
while(content != ""):
    cards.append(content.split("\t")[1][:-1])
    content = readfile.readline()
    x+=1
readfile.close()

totalcards = len(cards)

def get_pack():
    size = 5
    y = 0
    cardNamesinPack = []
    pictureNamesinPack = []
    while(y<size):
       rando = randint(0, totalcards - 1)
       cardNamesinPack.append(cards[rando])
       pictureNamesinPack.append(rando)
       y+=1
    return [cardNamesinPack, pictureNamesinPack]

@app.route("/api/getpack/")
def api():
    jsoncards = get_pack()
    username = request.args.get('username')
    if (username != ""):
        currentts = time.time()
        acc = CardGuard.find_one({"username": username})
        if acc is None:
            CardGuard.insert_one({
                "username": username,
                "cardsunlocked": jsoncards[1],
                "ts": time.time()
            })
        else: 
            ts = acc["ts"]
            if (currentts - ts < 5):
                return {
                    "Success": False,
                    "Time": (5 - currentts - ts)
                }
            CardGuard.update_one(
            {"username": username},
            {
                "$set": {
                    "cardsunlocked": jsoncards[1],
                    "ts": time.time()
                }
            }
            )
    return {
        "Success": True,
        "name1": jsoncards[0][0],
        "name2": jsoncards[0][1],
        "name3": jsoncards[0][2],
        "name4": jsoncards[0][3],
        "name5": jsoncards[0][4],
        "pic1": jsoncards[1][0],
        "pic2": jsoncards[1][1],
        "pic3": jsoncards[1][2],
        "pic4": jsoncards[1][3],
        "pic5": jsoncards[1][4]
    }

@app.route("/api/getpage/")
def getpage():
    username = request.args.get('username')
    page = int(request.args.get('page'))
    picturelist = Accounts.find_one({"username": username})["mycollection"]

    x = 0
    bigarray = []
    low = 50*(page - 1)
    high = 50*page

    if high > len(picturelist) :
        high = len(picturelist)
    x = 0
    while low < high:
        bigarray.append([picturelist[low] + ".jpg"])
        bigarray[x].append(cards[int(picturelist[low])])
        bigarray[x].append(low)
        low+=1
        x+=1
    return {"collection": bigarray}

@app.route("/api/login/")
def login():
    username = request.args.get('username')
    password = request.args.get('password')
    accnt  = Accounts.find_one({"username": username})
    if accnt is None:
        return {"Success": False}
    if (accnt["password"] != password):
        return {"Success": False}
    else:
        return {"Success": True}

@app.route("/api/pages/")
def getpages():
    username = request.args.get('username')
    return {"pages": math.ceil(len(Accounts.find_one({"username": username})["mycollection"])/50.0)}

@app.route("/api/addcard/")
def addcard():
    username = request.args.get('username')
    picname = request.args.get('card')
    try:
        allowables = CardGuard.find_one({"username": username})["cardsunlocked"]
        if int(picname) not in allowables:
            return {
                "Success": False
            }
        cards = Accounts.find_one({"username": username})["mycollection"]
        cards.append(picname)
        Accounts.update_one(
            {"username": username},
            {
                "$set": {
                    "mycollection": cards
                }
            }
        )

        return {"Success": True}
    except:
        return {"Success": False}

@app.route("/api/makeaccount/")
def makeaccount():
    username = request.args.get('username')
    password = request.args.get('password')
    email = request.args.get('email')
    fname = request.args.get('fname')
    lname = request.args.get('lname')
    acc = Accounts.find_one({"username": username})
    if acc is None:
        Accounts.insert_one({
            "fname": fname,
            "lname": lname,
            "email": email,
            "username": username,
            "password": password,
            "packs": 0,
            "mycollection": []
        })
        return {"Success": True}
    else:
        return {"Success": False}

@app.route("/api/rippack/")
def rippack():
    try:
        username = request.args.get('username')
        packs = Accounts.find_one({"username": username})["packs"]
        Accounts.update_one(
            {"username": username},
            {
                "$set": {
                    "packs": packs + 1
                }
            }
        )
        return {"Success": True}
    except:
        return {"Success": False}

@app.route("/api/gettotalcards/")
def gettotalcards():
    username = request.args.get('username')
    cardnum = len(Accounts.find_one({"username": username})["mycollection"])
    return {"total": cardnum}

@app.route("/api/gettotalpacks/")
def gettotalpacks():
    username = request.args.get('username')
    packnum = Accounts.find_one({"username": username})["packs"]
    return {"total": packnum}

@app.route("/api/removecard/")
def removecard():
    username = request.args.get('username')
    password = request.args.get('password')
    index = request.args.get('index')

    accnt  = Accounts.find_one({"username": username})
    if accnt is None:
        return {"Success": False}
    if (accnt["password"] != password):
        return {"Success": False}
    else:
        try:
            cards = Accounts.find_one({"username": username})["mycollection"]
            del cards[int(index)]
            Accounts.update_one(
                    {"username": username},
                    {
                        "$set": {
                            "mycollection": cards
                        }
                    }
                )

            return {"Success": True}
        except: 
            return {"Success": False}

@app.route("/api/searchuser/")
def searchuser():
    query = request.args.get('query')
    accs = []
    for acc in Accounts.find():
        accs.append(acc["username"])
    arr = process.extract(query, accs, limit=20)
    x = 0
    newarr = []
    while x < len(arr):
        newarr.append([arr[x][0]])
        newarr[x].append(len(Accounts.find_one({"username": arr[x][0]})["mycollection"]))
        x+=1
    return(
        {
            "results": newarr
        }
    )

@app.route("/api/searchcards/")
def searchcard():
    query = request.args.get('query')

    arr = process.extract(query, cards, limit=10)
    
    bigarray = []

    x = 0
    while x < len(arr):
        bigarray.append([str(cards.index(arr[x][0])) + ".jpg"])
        bigarray[x].append(arr[x][0])
        bigarray[x].append(x)
        x+=1
    return(
        {
            "results": bigarray
        }
    )
    

if __name__ == '__main__':
    app.run()

