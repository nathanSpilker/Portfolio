import pitchGame 
import random
import math
import flask
from flask_cors import CORS, cross_origin
from flask import request
import os
from fuzzywuzzy import process
import time
import json

app = flask.Flask("__main__")
CORS(app)
cors = CORS(app, resources={
    r"/*": {
        "origins": "*"
    }
})
app.config['CORS_HEADERS'] = "Content-Type"

myHand = ["2", "3", "4", "5", "10", "22", "29", "50"]

json_template = {"user1": "", "user2": "", "user3": "", "user4": "", "hand1": [], "hand2": [], "hand3": [], "hand4": [], 
                "dealer": 1, "currentBidder": "", "currentBid": "", "bidWinner": "", "score1": "", "score2": "", "deck": [], "gameStarted": "0", "dealIdx": 1}

def runPitchGame():
    pg = pitchGame()
    while pg.gameWon() == 0:

        # Start hand
        pg.reloadDeck()
        pg.shuffle()
        pg.deal()
        
@app.route("/api/cards/")
def getCards():
    gameCode = request.args.get('gameCode')
    username = request.args.get('username')
    jsonFile = open(str(gameCode) + ".json", 'r+', encoding='utf-8')
    data = json.load(jsonFile)
    myHand = data["hand1"]
    myIndex = ""
    for i in range (1,5):
        if username == data["user" + str(i)]:
            myIndex = i-1
    cardCount2 = len(data["hand" + str((myIndex + 1)%4 + 1)])
    cardCount3 = len(data["hand" + str((myIndex + 2)%4 + 1)])
    cardCount4 = len(data["hand" + str((myIndex + 3)%4 + 1)])
    jsonFile.close()
    return {"myHand": myHand, "cardCount2": cardCount2, "cardCount3": cardCount3, "cardCount4": cardCount4}

@app.route("/api/makeGameFile/")
def makeGameFile():
    gameCode = random.randint(100000, 999999)
    game_file = open(str(gameCode) + '.json', 'w+', encoding='utf-8')
    jsonString = json.dumps(json_template, indent=4)
    game_file.write(jsonString)
    game_file.close()
    return {"gameCode": gameCode}

@app.route("/api/removeCard/")
def removecard():
    remCard = int(request.args.get('remCard'))
    gameCode = request.args.get('gameCode')
    jsonFile = open(str(gameCode) + ".json", 'r+', encoding='utf-8')
    data = json.load(jsonFile)
    hand = data["hand1"]
    hand.pop(remCard)
    jsonFile.seek(0)
    json.dump(data, jsonFile, indent=4)
    jsonFile.truncate()
    jsonFile.close()
    return {"Success": True}

@app.route("/api/shuffle/")
def shuffleDeck():
    gameCode = request.args.get('gameCode')
    deck = []
    shuffled_deck = []
    for i in range(54):
        deck.append(i + 1)
    for i in range(54):
        rand = random.randint(0, len(deck) - 1)
        shuffled_deck.append(deck.pop(rand))    
    jsonFile = open(str(gameCode) + ".json", 'r+', encoding='utf-8')
    data = json.load(jsonFile)
    data["deck"] = shuffled_deck
    jsonFile.seek(0)
    json.dump(data, jsonFile, indent=4)
    jsonFile.truncate()
    jsonFile.close()

    return {"Success": True}

@app.route("/api/deal/")
def deal():
    gameCode = request.args.get('gameCode')
    jsonFile = open(str(gameCode) + ".json", 'r+', encoding='utf-8')
    data = json.load(jsonFile)
    deck = data["deck"]
    hands = [[],[],[],[]]
    for i in range(9):
        for j in range(len(hands)):
            hands[j].append(deck.pop(0))
    data["deck"] = deck
    data["hand1"] = hands[0]
    data["hand2"] = hands[1]
    data["hand3"] = hands[2]
    data["hand4"] = hands[3]
    jsonFile.seek(0)
    json.dump(data, jsonFile, indent=4)
    jsonFile.close()
    return {"Success": True}

@app.route("/api/handleBid/")
def handleBid():
    gameCode = request.args.get('gameCode')
    bid = request.args.get('bid')
    username = request.args.get('username')

    jsonFile = open(str(gameCode) + ".json", 'r+', encoding='utf-8')
    data = json.load(jsonFile)
    if (bid != "pass"):
        data["currentBid"] = bid
        data["bidWinner"] = username

    jsonFile.seek(0)
    json.dump(data, jsonFile, indent=4)
    jsonFile.close()
    return {"Success": True}

@app.route("/api/editOrder/")
def editOrder():
    gameCode = request.args.get('gameCode')
    pos1 = int(request.args.get('pos1'))
    pos2 = int(request.args.get('pos2'))
    username = request.args.get('username')

    jsonFile = open(str(gameCode) + ".json", 'r+', encoding='utf-8')
    data = json.load(jsonFile)
    hand = data["hand1"]
    if pos2 >= len(hand):
        pos2 = len(hand) - 1

    if pos1 > pos2:
        pos1Card = hand[pos1]
        i = pos1
        while i > pos2:
            hand[i] = hand[i - 1]
            i-=1
        hand[pos2] = pos1Card
    elif pos2 > pos1:
        pos1Card = hand[pos1]
        for i in range(pos1,pos2):
            hand[i] = hand[i + 1]
        hand[pos2] = pos1Card

    jsonFile.seek(0)
    json.dump(data, jsonFile, indent=4)
    jsonFile.close()

    return {"Shuffled": True}

@app.route("/api/spot/")
def addSpot():
    gameCode = request.args.get('gameCode')
    username = request.args.get('username')
    spot = request.args.get('spot')

    jsonFile = open(str(gameCode) + ".json", 'r+', encoding='utf-8')
    data = json.load(jsonFile)
    data["user" + spot] = username

    jsonFile.seek(0)
    json.dump(data, jsonFile, indent=4)
    jsonFile.close()

    return {"Success": True}

@app.route("/api/getGameInfo/")
def getGameInfo():
    gameCode = request.args.get('gameCode')

    jsonFile = open(str(gameCode) + ".json", 'r+', encoding='utf-8')
    data = json.load(jsonFile)
    user1 = data["user1"]
    user2 = data["user2"]
    user3 = data["user3"]
    user4 = data["user4"]
    gameStart = data["gameStarted"]
    jsonFile.close()

    return {"user1": user1, "user2": user2, "user3": user3, "user4": user4, "gameStarted": gameStart}

@app.route("/api/beginGame/")
def beginGame():
    gameCode = request.args.get('gameCode')
    jsonFile = open(str(gameCode) + ".json", 'r+', encoding='utf-8')
    data = json.load(jsonFile)
    data["gameStarted"] = 1
    jsonFile.seek(0)
    json.dump(data, jsonFile, indent=4)
    jsonFile.truncate()
    jsonFile.close()

    return {"Success": True}

# @app.route("api/getGameControl")
# def gameControl():
#     gameCode = request.args.get('gameCode')
#     username = request.args.get('username')
#     jsonFile = open(str(gameCode) + ".json", 'r+', encoding='utf-8')
#     data = json.load(jsonFile)
#     state = data["gameState"]
#     jsonFile.close()

#     return {"gameState": state}


# @app.route("api/updateGameControl")
# def gameControl():
#     gameCode = request.args.get('gameCode')
#     username = request.args.get('username')
    
#     jsonFile = open(str(gameCode) + ".json", 'r+', encoding='utf-8')
    



app.run(port=5000)