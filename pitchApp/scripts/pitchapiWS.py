import pitchGame 
import random
import math
import flask
from flask_cors import CORS, cross_origin
from flask_sock import Sock
from flask import request, session
import os
from fuzzywuzzy import process
import time
import json
import numpy as np
from flask_sock import ConnectionClosed
import uuid 

app = flask.Flask("__main__")
app.config['SOCK_SERVER_OPTIONS'] = {'ping_interval': 2}
sock = Sock(app)
CORS(app)
cors = CORS(app, resources={
    r"/*": {
        "origins": "*"
    }
})

client_list = {}
client_list_game = {}
client_connected_to_game = {}
client_list_chat = {}

SUIT_INDS = ["clubs", "spades", "hearts", "diamonds"]
CLUBS_INDS =  [1, 5,  9, 13, 17, 21, 25, 29, 33, 41, 42, 46, 43, 51, 47, 37]
DMDS_INDS =   [2, 6, 10, 14, 18, 22, 26, 30, 34, 41, 42, 45, 44, 52, 48, 38]
HEARTS_INDS = [3, 7, 11, 15, 19, 23, 27, 31, 35, 41, 42, 44, 45, 53, 49, 39]
SPADES_INDS = [4, 8, 12, 16, 20, 24, 28, 32, 36, 41, 42, 43, 46, 54, 50, 40]
PTS_BY_IND_NO_2 =  [0, 3, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1]
TRUE_IND_TO_EFF_IND = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 11, 12, 13, 14, 15]

INDS_ARR = [CLUBS_INDS, SPADES_INDS, HEARTS_INDS, DMDS_INDS]

json_template = {"user1": "", "user2": "", "user3": "", "user4": "", "lcode1": "", "lcode2": "", "lcode3": "", "lcode4": "", "hand1": [], "hand2": [], "hand3": [], "hand4": [], 
                "dealer": 1, "currentBidder": 2, "bidHolder": 1, "currentBid": "0", "bidWinner": "", "score1": 0, "score2": 0, "deck": [], "gameStarted": 0, "dealIdx": 1, "suit": "",
                "confirmed1": False, "confirmed2": False, "confirmed3": False, "confirmed4": False, "playedCard1": "", "playedCard2": "", "playedCard3": "", "playedCard4": "", "lead": "", "cardsPlayedInOrder": [],
                "OutOfCards1": 0, "OutOfCards2": 0, "OutOfCards3": 0, "OutOfCards4": 0, "ScoreThisRound1": 0, "ScoreThisRound2": 0, "passed": False, "uid1": "", "uid2": "", "uid3": "", "uid4": ""}


@sock.route("/StartPageSocket")
def StartPageSocket(ws):
    while True:
        text = ws.receive()
        print(text)
        textJson = json.loads(text)
        if textJson != "":

            if textJson['event'] == 'openSocket':

                uid = generateUID()

                dataSend = {}
                dataSend["event"] = "uidPush"
                dataSend["uid"] = uid

                ws.send(dataSend)

            if textJson['event'] == 'gameCheck':
                gameCode = textJson['gameCode']

                fileExists = 0
                if os.path.isfile(str(gameCode) + ".json"):
                    fileExists = 1

                dataSend = {}
                dataSend["event"] = "gameExistsPush"
                dataSend["gameExists"] = fileExists

                ws.send(dataSend)

            if textJson['event'] == 'registerForGame':
                gameCode = textJson['gameCode']

                if str(gameCode) not in client_list:
                    client_list[str(gameCode)] = []
                    client_list_game[str(gameCode)] = {}  
                    client_connected_to_game[str(gameCode)] = {}  

                if ws not in client_list[str(gameCode)]:
                    client_list[str(gameCode)].append(ws)

                pushSpots(gameCode)

            if textJson['event'] == 'spotDecision':
                gameCode = textJson['gameCode']

                userName = textJson['userName']
                spot = textJson['spotChoice']
                logoCode = textJson['logoCode']
                uid = textJson['uid']

                addSpot(gameCode, userName, logoCode, spot, uid)

                pushSpots(gameCode)

            if textJson['event'] == 'beginGame':
                gameCode = textJson['gameCode']
                dataSend = {}
                dataSend['event'] = 'beginGamePush'
                
                for wsItr in client_list[str(gameCode)]:
                    wsItr.send(dataSend)

                del client_list[str(gameCode)]
            
            def generateUID():
                return(uuid.uuid1())

@sock.route("/ChatSocket")
def ChatSocket(ws):
    while True:
        text = ws.receive()
        print(text)
        textJson = json.loads(text)
        if textJson != "":
            gameCode = textJson['gameCode']
            userName = textJson['userName']
            uid = textJson['uid']

            jsonFile = open(str(gameCode) + ".json", 'r+', encoding='utf-8')
            data = json.load(jsonFile)
            if textJson['event'] == 'RegisterForChat':
                if str(gameCode) not in client_list_chat:
                    client_list_chat[str(gameCode)] = {}  


                if ws not in client_list_chat[str(gameCode)]:
                    client_list_chat[str(gameCode)][str(uid)] = ws
                else:
                    client_list_chat[str(gameCode)][str(uid)] = ws

            else:        
                ws1 = getWS(gameCode, 1)
                ws2 = getWS(gameCode, 2)
                ws3 = getWS(gameCode, 3)
                ws4 = getWS(gameCode, 4)


            if textJson['event'] == 'chatSend':
                dataSend = {}
                dataSend["event"] = "chatPush"
                dataSend["chat"] = textJson["chatText"]
                dataSend["userChatted"] = userName

                ws1.send(dataSend)
                ws2.send(dataSend)
                ws3.send(dataSend)
                ws4.send(dataSend)

            def getWS(gameCode, ind):
                return client_list_chat[str(gameCode)][data['uid' + str(ind)]]


def addSpot(gameCode, username, logoCode, spot, uid):
    jsonFile = open(str(gameCode) + ".json", 'r+', encoding='utf-8')
    data = json.load(jsonFile)
    data["user" + spot] = username
    data["lcode" + spot] = logoCode
    data["uid" + spot] = logoCode

    jsonFile.seek(0)
    json.dump(data, jsonFile, indent=4)
    jsonFile.truncate()
    jsonFile.close()
    return {"Success": True}


def pushSpots(gameCode):
    jsonFile = open(str(gameCode) + ".json", 'r', encoding='utf-8')
    data = json.load(jsonFile)
    dataSend = {}
    dataSend["event"] = "spotPush"
    dataSend["user1"] = data["user1"]
    dataSend["user2"] = data["user2"]
    dataSend["user3"] = data["user3"]
    dataSend["user4"] = data["user4"]
    dataSend["lcode1"] = data["lcode1"]
    dataSend["lcode2"] = data["lcode2"]
    dataSend["lcode3"] = data["lcode3"]
    dataSend["lcode4"] = data["lcode4"]
    jsonFile.close()

    for wsItr in client_list[str(gameCode)]:
        wsItr.send(dataSend)


# @socketio.on("disconnect")
# def disconnected():
#     """event listener when client disconnects to the server"""
#     print("user disconnected")
#     emit("disconnect",f"user {request.sid} disconnected",broadcast=True)

@app.route("/makeGameFile/")
def makeGameFile():
    gameCode = random.randint(100000, 999999)
    game_file = open(str(gameCode) + '.json', 'w+', encoding='utf-8')
    jsonString = json.dumps(json_template, indent=4)
    game_file.write(jsonString)
    game_file.close()
    return {"gameCode": gameCode}

@sock.route("/GameSocket")
def GameSocket(ws):

    userInfo = ""
    gameCodeInfo = ""
    try:
        while True:
            text = ws.receive()
            print(text)
            textJson = json.loads(text)
            if textJson != "":

                gameCode = textJson['gameCode']
                username = textJson['userName']
                uid = textJson['uid']

                gameCodeInfo = str(gameCode)
                userInfo = str(username)

                jsonFile = open(str(gameCode) + ".json", 'r+', encoding='utf-8')
                data = json.load(jsonFile)
                
                if textJson['event'] == "RegisterForGame":                          
                    if uid not in client_list_game[str(gameCode)]:

                        client_list_game[str(gameCode)][str(uid)] = ws
                        client_connected_to_game[str(gameCode)][str(uid)] = True
                        dataSend = {}
                        dataSend['event'] = "dealerPush"
                        dataSend['currentDealer'] = data['dealIdx']

                        ws.send(dataSend)
                    else:
                        client_list_game[str(gameCode)][str(uid)] = ws
                        client_connected_to_game[str(gameCode)][str(uid)] = True

                else:
                    
                    ws1 = getWS(gameCode, 1)
                    ws2 = getWS(gameCode, 2)
                    ws3 = getWS(gameCode, 3)
                    ws4 = getWS(gameCode, 4)

                    

                    if textJson['event'] == 'UserDeal':
                        
                        hand1 = []
                        hand2 = []
                        hand3 = []
                        hand4 = []

                        deck = []
                        shuffled_deck = []
                        for i in range(54):
                            deck.append(i + 1)
                        for i in range(54):
                            rand = random.randint(0, len(deck) - 1)
                            shuffled_deck.append(deck.pop(rand))

                        for i in range(9):
                            hand1.append(shuffled_deck.pop(0))
                            hand2.append(shuffled_deck.pop(0))
                            hand3.append(shuffled_deck.pop(0))
                            hand4.append(shuffled_deck.pop(0))

                        data['hand1'] = hand1
                        data['hand2'] = hand2
                        data['hand3'] = hand3
                        data['hand4'] = hand4

                        data['deck'] = shuffled_deck

                        dataSend1 = {}
                        dataSend1['event'] = "handPush"
                        dataSend1['myHand'] = hand1

                        dataSend2 = {}
                        dataSend2['event'] = "handPush"
                        dataSend2['myHand'] = hand2

                        dataSend3 = {}
                        dataSend3['event'] = "handPush"
                        dataSend3['myHand'] = hand3

                        dataSend4 = {}
                        dataSend4['event'] = "handPush"
                        dataSend4['myHand'] = hand4

                        ws1.send(dataSend1)
                        ws2.send(dataSend2)
                        ws3.send(dataSend3)
                        ws4.send(dataSend4)

                        dataSend = {}
                        dataSend['event'] = "bidPush"
                        dataSend['currentBid'] = "0"
                        dataSend['currentBidder'] = data['dealIdx']%4 + 1
                        dataSend['bidHolder'] = ""
                        
                        data['currentBidder'] = dataSend['currentBidder']
                        
                        ws1.send(dataSend)
                        ws2.send(dataSend)
                        ws3.send(dataSend)
                        ws4.send(dataSend)
                        
                    if textJson['event'] == 'BidInfo':

                        bid = textJson['bid']

                        legalPlay = True

                        if bid != "pass":

                            bidInt = int(bid)

                            if bidInt > int(data['currentBid']):
                                data['currentBid'] = bid
                                data['bidHolder'] = data['currentBidder']
                            else:
                                legalPlay = False

                        if bid == "pass" and data['dealIdx'] == data['currentBidder'] and data['currentBid'] == "0":
                            legalPlay = False

                        if legalPlay:
                            if (data['dealIdx'] != data['currentBidder']):

                                data['currentBidder'] = (data['currentBidder'] % 4) + 1

                                dataSend = {}
                                dataSend['event'] = "bidPush"
                                dataSend['currentBid'] = data['currentBid']
                                dataSend['currentBidder'] = data['currentBidder']
                                dataSend['bidHolder'] = data['bidHolder']

                                ws1.send(dataSend)
                                ws2.send(dataSend)
                                ws3.send(dataSend)
                                ws4.send(dataSend)
                            else:
                                data['bidWinner'] = data['bidHolder']

                                dataSend = {}
                                dataSend['event'] = "bidWinner"
                                dataSend['bid'] = data['currentBid']
                                dataSend['bidWinner'] = data['bidWinner']

                                ws1.send(dataSend)
                                ws2.send(dataSend)
                                ws3.send(dataSend)
                                ws4.send(dataSend)

                    if textJson['event'] == 'SuitChoice':
                        suit = textJson['suitChoice']


                        data['suit'] = SUIT_INDS.index(suit)
                        dataSend = {}
                        dataSend['event'] = "suitPush"
                        dataSend['suit'] = suit

                        ws1.send(dataSend)
                        ws2.send(dataSend)
                        ws3.send(dataSend)
                        ws4.send(dataSend)

                    if textJson['event'] == 'DiscChoice':
                        handRem = textJson['handRem']

                        userInd = 0
                        for i in range(1,5):
                            if data["user" + str(i)] == username:
                                userInd = i
                                break

                        data['hand' + str(userInd)] = handRem
                        data['confirmed' + str(userInd)] = True

                        dataSend = {}
                        dataSend['event'] = "numCardsPush"

                        dataSend['cardsRem1'] = len(data['hand1'])
                        dataSend['cardsRem2'] = len(data['hand2'])
                        dataSend['cardsRem3'] = len(data['hand3'])
                        dataSend['cardsRem4'] = len(data['hand4'])

                        ws1.send(dataSend)
                        ws2.send(dataSend)
                        ws3.send(dataSend)
                        ws4.send(dataSend)

                        if (data['confirmed1'] and data['confirmed2'] and data['confirmed3'] and data['confirmed4']):
                            
                            deck = data["deck"]

                            hand1 = data["hand1"]
                            h1req = 0
                            while len(hand1) < 6:
                                hand1.append(deck.pop(0))
                                h1req+=1

                            hand2 = data["hand2"]
                            h2req = 0
                            while len(hand2) < 6:
                                hand2.append(deck.pop(0))
                                h2req+=1

                            hand3 = data["hand3"]
                            h3req = 0
                            while len(hand3) < 6:
                                hand3.append(deck.pop(0))
                                h3req+=1

                            hand4 = data["hand4"]
                            h4req = 0
                            while len(hand4) < 6:
                                hand4.append(deck.pop(0))
                                h4req+=1

                            cardsRemInDeck = len(deck)
                            

                            dataSend1 = {}
                            dataSend2 = {}
                            dataSend3 = {}
                            dataSend4 = {}

                            dataSend1["event"] = "handFillPush"
                            dataSend2["event"] = "handFillPush"
                            dataSend3["event"] = "handFillPush"
                            dataSend4["event"] = "handFillPush"

                            dataSend1["myHand"] = hand1
                            dataSend2["myHand"] = hand2
                            dataSend3["myHand"] = hand3
                            dataSend4["myHand"] = hand4

                            dataSend1["cardsAdded1"] = h1req
                            dataSend1["cardsAdded2"] = h2req
                            dataSend1["cardsAdded3"] = h3req
                            dataSend1["cardsAdded4"] = h4req
                            dataSend1["cardsRemInDeck"] = cardsRemInDeck

                            dataSend2["cardsAdded1"] = h1req
                            dataSend2["cardsAdded2"] = h2req
                            dataSend2["cardsAdded3"] = h3req
                            dataSend2["cardsAdded4"] = h4req
                            dataSend2["cardsRemInDeck"] = cardsRemInDeck

                            dataSend3["cardsAdded1"] = h1req
                            dataSend3["cardsAdded2"] = h2req
                            dataSend3["cardsAdded3"] = h3req
                            dataSend3["cardsAdded4"] = h4req
                            dataSend3["cardsRemInDeck"] = cardsRemInDeck

                            dataSend4["cardsAdded1"] = h1req
                            dataSend4["cardsAdded2"] = h2req
                            dataSend4["cardsAdded3"] = h3req
                            dataSend4["cardsAdded4"] = h4req
                            dataSend4["cardsRemInDeck"] = cardsRemInDeck

                            ws1.send(dataSend1)
                            ws2.send(dataSend2)
                            ws3.send(dataSend3)
                            ws4.send(dataSend4)

                    if textJson['event'] == 'PassDeck':
                        bidWinUser = data["bidWinner"]

                        pass2 = (bidWinUser + 1) % 4 + 1

                        dataSend = {}
                        dataSend["event"] = "passPush"
                        dataSend["passTo"] = pass2

                        data["passed"] = True
                        
                        ws1.send(dataSend)
                        ws2.send(dataSend)
                        ws3.send(dataSend)
                        ws4.send(dataSend)

                    if textJson['event'] == 'FlipACard':
                        deck = data["deck"]

                        if len(deck) != 0:
                            flipPush = deck.pop(0)
                        else:
                            flipPush = ""

                        
                        dataSend = {}
                        dataSend["event"] = "flipCardPush"
                        dataSend["flippedCard"] = flipPush
                        dataSend["cardsRemain"] = len(deck)

                        if not data["passed"]:
                            if data["bidWinner"] == 1:
                                ws1.send(dataSend)
                            if data["bidWinner"] == 2:
                                ws2.send(dataSend)
                            if data["bidWinner"] == 3:
                                ws3.send(dataSend)
                            if data["bidWinner"] == 4:
                                ws4.send(dataSend)
                        else:
                            if data["bidWinner"] == 1:
                                ws3.send(dataSend)
                            if data["bidWinner"] == 2:
                                ws4.send(dataSend)
                            if data["bidWinner"] == 3:
                                ws1.send(dataSend)
                            if data["bidWinner"] == 4:
                                ws2.send(dataSend)

                    if textJson['event'] == 'ResetHand':
                        
                        for i in range(1,5):
                            if data["user" + str(i)] == username:
                                userInd = i
                                break

                        data['hand' + str(userInd)] = textJson["myHand"]

                    if textJson['event'] == 'PlayingStartInfo':
                        
                        dataSend = {}
                        dataSend["event"] = "playStartPush"
                        dataSend["lead"] = data["bidWinner"]
                        data["lead"] = data["bidWinner"]

                        ws1.send(dataSend)
                        ws2.send(dataSend)
                        ws3.send(dataSend)
                        ws4.send(dataSend)

                    if textJson['event'] == 'PlayedCardInfo':

                        for i in range(1,5):
                            if data["user" + str(i)] == username:
                                userInd = i
                                break

                        currCardsPlayedInOrder = data["cardsPlayedInOrder"]
                        currCardsPlayedInOrder.append(textJson["playedCard"])
                        data["cardsPlayedInOrder"] = currCardsPlayedInOrder
                        data["playedCard" + str(userInd)] = textJson["playedCard"]
                        hand = data["hand" + str(userInd)]
                        hand.remove(data["playedCard" + str(userInd)])

                        data["hand" + str(userInd)] = hand

                        dataSend = {}
                        dataSend["event"] = "playedCardPush"

                        if (data["playedCard1"] == "" or data["playedCard2"] == "" or data["playedCard3"] == "" or data["playedCard4"] == ""):
                            for i in range(4):
                                newLead = ((userInd + i) % 4) + 1
                                handOfLeader = data["hand" + str(newLead)]
                                print(handOfLeader)

                                legalPlayLeft = False
                                for j in range(len(handOfLeader)):
                                    if handOfLeader[j] in INDS_ARR[data["suit"]]:
                                        legalPlayLeft = True
                                        break

                                if not legalPlayLeft:
                                    data["OutOfCards" + str(newLead)] = 1
                                    data["playedCard" + str(newLead)] = -1
                                    data["cardsPlayedInOrder"].append(-1)

                                if legalPlayLeft:
                                    dataSend["lead"] = newLead
                                    break

                                if (data["playedCard1"] != "" and data["playedCard2"] != "" and data["playedCard3"] != "" and data["playedCard4"] != ""):
                                    break
                            
                        doneWithTrick = False
                        team1Pts = 0
                        team2Pts = 0

                        if (data["playedCard1"] != "" and data["playedCard2"] != "" and data["playedCard3"] != "" and data["playedCard4"] != ""):
                                
                            cardInds = []
                            for i in range(4):
                                if (data["cardsPlayedInOrder"][i] == -1):
                                    cardInds.append(-1)
                                else:
                                    tempVal = INDS_ARR[data["suit"]].index(data["cardsPlayedInOrder"][i])
                                    cardInds.append(TRUE_IND_TO_EFF_IND[tempVal])

                            trickWinner = int(np.argmax(cardInds))

                            twoInd = -1
                            if 0 in cardInds:
                                twoInd = cardInds.index(0)

                            if twoInd != -1:
                                if twoInd == 0 or twoInd == 2:
                                    team1Pts += 1
                                else:
                                    team2Pts += 1

                            ptTotal = 0
                            for i in range(4):
                                if cardInds[i] != -1:
                                    ptTotal += PTS_BY_IND_NO_2[cardInds[i]]

                            if trickWinner == 0 or trickWinner == 2:
                                team1Pts += ptTotal

                            else:
                                team2Pts += ptTotal


                            if data["lead"] == 2 or data["lead"] == 4:
                                team1PtsTemp = team1Pts
                                team2PtsTemp = team2Pts

                                team1Pts = team2PtsTemp
                                team2Pts = team1PtsTemp

                            newLead = ((data["lead"] + (trickWinner) - 1) % 4) + 1
                            
                            data["lead"] = newLead
                            dataSend["lead"] = newLead

                            doneWithTrick = True

                        if (doneWithTrick):
                            dataSend["doneWithTrick"] = 1
                            dataSend["trickWinner"] = data["lead"] 
                        else:
                            dataSend["doneWithTrick"] = 0


                        dataSend["playedCard1"] = data["playedCard1"] 
                        dataSend["playedCard2"] = data["playedCard2"] 
                        dataSend["playedCard3"] = data["playedCard3"] 
                        dataSend["playedCard4"] = data["playedCard4"]
                        dataSend["Out1"] = data["OutOfCards1"] 
                        dataSend["Out2"] = data["OutOfCards2"] 
                        dataSend["Out3"] = data["OutOfCards3"] 
                        dataSend["Out4"] = data["OutOfCards4"]

                        ws1.send(dataSend)
                        ws2.send(dataSend)
                        ws3.send(dataSend)
                        ws4.send(dataSend)

                        if doneWithTrick:
                            data["playedCard1"] = "" 
                            data["playedCard2"] = "" 
                            data["playedCard3"] = "" 
                            data["playedCard4"] = ""

                            data["cardsPlayedInOrder"] = []

                            data["ScoreThisRound1"] += team1Pts
                            data["ScoreThisRound2"] += team2Pts

                            dataSend = {}
                            if ((data["ScoreThisRound1"] + data["ScoreThisRound2"]) == 10):
                                

                                if (data["bidWinner"] == 1 or data["bidWinner"] == 3):
                                    if (data["ScoreThisRound1"] < int(data["currentBid"])):
                                        data["score1"] -= int(data["currentBid"])
                                    else:
                                        data["score1"] += data["ScoreThisRound1"] 
                                    data["score2"] += data["ScoreThisRound2"] 
                                else:
                                    if (data["ScoreThisRound2"] < int(data["currentBid"])):
                                        data["score2"] -= int(data["currentBid"])
                                    else:
                                        data["score2"] += data["ScoreThisRound2"] 
                                    data["score1"] += data["ScoreThisRound1"] 

                                winningTeam = -1

                                if (data["score1"] > 52 and (((data["bidWinner"] == 1 or data["bidWinner"] == 3) and (data["ScoreThisRound1"] > 0) ) or (data["ScoreThisRound2"] < int(data["currentBid"])))):
                                    winningTeam = 1
                                if (data["score2"] > 52 and (((data["bidWinner"] == 2 or data["bidWinner"] == 4) and (data["ScoreThisRound2"] > 0) ) or (data["ScoreThisRound1"] < int(data["currentBid"])))):
                                    winningTeam = 2

                                data["hand1"] = []
                                data["hand2"] = []
                                data["hand3"] = []
                                data["hand4"] = []
                                data["dealIdx"] = (data["dealIdx"] % 4) + 1
                                data["currentBid"] = "0"
                                data["bidWinner"] = ""
                                data["deck"] = []
                                data["suit"] = ""
                                data["confirmed1"] = False
                                data["confirmed2"] = False
                                data["confirmed3"] = False
                                data["confirmed4"] = False
                                data["playedCard1"] = ""
                                data["playedCard2"] = ""
                                data["playedCard3"] = ""
                                data["playedCard4"] = ""
                                data["lead"] = ""
                                data["cardsPlayedInOrder"] = []
                                data["OutOfCards1"] = 0
                                data["OutOfCards2"] = 0
                                data["OutOfCards3"] = 0
                                data["OutOfCards4"] = 0
                                data["ScoreThisRound1"] = 0
                                data["ScoreThisRound2"] = 0
                                data["passed"] = False

                                if (winningTeam != -1):
                                    dataSend["event"] = "GameOverPush"
                                    dataSend["winningTeam"] = winningTeam
                                    dataSend["team1Score"] = data["score1"]
                                    dataSend["team2Score"] = data["score2"]
                                else:
                                    dataSend["event"] = "RoundOverPush"
                                    dataSend["team1Score"] = data["score1"]
                                    dataSend["team2Score"] = data["score2"]
                                    dataSend["currentDealer"] = data["dealIdx"]

                            else:
                                dataSend["event"] = "HandResetPush"
                                dataSend["team1Pts"] = data["ScoreThisRound1"]
                                dataSend["team2Pts"] = data["ScoreThisRound2"]

                                newLead = data["lead"]
                                for i in range(4):
                                    handOfLeader = data["hand" + str(newLead)]

                                    legalPlayLeft = False
                                    for j in range(len(handOfLeader)):
                                        if handOfLeader[j] in INDS_ARR[data["suit"]]:
                                            legalPlayLeft = True
                                            break

                                    if not legalPlayLeft:
                                        data["OutOfCards" + str(newLead)] = 1
                                        data["playedCard" + str(newLead)] = -1
                                        data["cardsPlayedInOrder"].append(-1)

                                    if legalPlayLeft:
                                        data["lead"] = newLead
                                        dataSend["lead"] = newLead
                                        break

                                    newLead = (newLead % 4) + 1


                                dataSend["lead"] = data["lead"]
                                dataSend["playedCard1"] = data["playedCard1"] 
                                dataSend["playedCard2"] = data["playedCard2"] 
                                dataSend["playedCard3"] = data["playedCard3"] 
                                dataSend["playedCard4"] = data["playedCard4"]
                                dataSend["Out1"] = data["OutOfCards1"] 
                                dataSend["Out2"] = data["OutOfCards2"] 
                                dataSend["Out3"] = data["OutOfCards3"] 
                                dataSend["Out4"] = data["OutOfCards4"]

                            time.sleep(5)

                            ws1.send(dataSend)
                            ws2.send(dataSend)
                            ws3.send(dataSend)
                            ws4.send(dataSend)

                    if textJson['event'] == 'RestartGame':
                        data["score1"] = 0
                        data["score2"] = 0
                        data["dealer"] = 1
                        data["currentBidder"] = 2
                        data["dealIdx"] = 1

                        dataSend = {}
                        dataSend["event"] = "restartGamePush"
                        dataSend['currentDealer'] = data['dealIdx']

                        ws1.send(dataSend)
                        ws2.send(dataSend)
                        ws3.send(dataSend)
                        ws4.send(dataSend)

                    
                jsonFile.seek(0)
                json.dump(data, jsonFile, indent=4)
                jsonFile.truncate()
                jsonFile.close()

            def getWS(gameCode, ind):
                return client_list_game[str(gameCode)][data['uid' + str(ind)]]

    except ConnectionClosed:
        print(userInfo + " disconnected.")   
        # TODO: handle reconnecting gracefully
        client_connected_to_game[gameCodeInfo][userInfo] = False
        userStillConnected = False
        for user in (client_connected_to_game[gameCodeInfo]):
            if client_connected_to_game[gameCodeInfo][user] == True:
                userStillConnected = True
                break

        if not userStillConnected:
            os.remove(gameCodeInfo + ".json")
            del client_connected_to_game[gameCodeInfo]


if __name__ == "__main__":
    # app.run(host='0.0.0.0')
    app.run()

