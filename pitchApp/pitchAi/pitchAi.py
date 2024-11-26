import numpy as np
import random
import tensorflow as tf


def my_loss_fn(y_true, y_pred):

    indArr = tf.cast((y_true != 0), dtype=tf.float32)
    y_true = y_true * indArr
    y_pred = y_pred * indArr

    error = y_true - y_pred

    sqr_error = K.square(error)
    #mean of the square of the error
    mean_sqr_error = K.mean(sqr_error)
    #square root of the mean of the square of the error
    sqrt_mean_sqr_error = K.sqrt(mean_sqr_error)
    #return the error
    return sqrt_mean_sqr_error


# Load the TFLite model and allocate tensors.
interpreterR = tf.lite.Interpreter(model_path='roundModel.tflite')
interpreterR.allocate_tensors()

# Get input and output tensors.
input_detailsR = interpreterR.get_input_details()
output_detailsR = interpreterR.get_output_details()

# # Load the TFLite model and allocate tensors.
# interpreterB = tf.lite.Interpreter(model_path='bidModel.tflite')
# interpreterB.allocate_tensors()

# # Get input and output tensors.
# input_detailsB = interpreterB.get_input_details()
# output_detailsB = interpreterB.get_output_details()



INPUT_VEC_SIZE = 87
OUT_VEC_SIZE = 16

CARDS_2ND_PHASE_IND_START = 0
OTHER_CARDS_2ND_PHASE_IND_START = 16
TEAM_CARD_IND_START = 32
OTHER_CARD_1_IND_START = 48
OTHER_CARD_2_IND_START = 64
CURR_BID_IND = 80
TEAM_HAS_BID_IND = 81
OTHER_TEAM_HAS_BID_IND = 82
MY_PTS_IND = 83
THEIR_PTS_IND = 84
MY_PTS_ROUND_IND = 85
THEIR_PTS_ROUND_IND = 86

BID_INPUT_VEC_SIZE = 57
BID_OUT_VEC_SIZE = 11

BID_CURR_BID_IND = 54
BID_TEAM_HAS_BID_IND = 55
BID_OTHER_TEAM_HAS_BID_IND = 56
BID_SUIT_START = 7

MIN_BID = 5

numTotalGames = 1
VERBOSE = 1

SPADE_INDS  = [ 0,  1,  2,  3,  4,  5,  6,  7,  8, 52, 53, 22,  9, 10, 11, 12]
CLUBS_INDS  = [13, 14, 15, 16, 17, 18, 19, 20, 21, 52, 53,  9, 22, 23, 24, 25]
HEARTS_INDS = [26, 27, 28, 29, 30, 31, 32, 33, 34, 52, 53, 48, 35, 36, 37, 38]
DMDS_INDS   = [39, 40, 41, 42, 43, 44, 45, 46, 47, 52, 53, 35, 48, 49, 50, 51]

SUIT_INDS_LIST = [SPADE_INDS, CLUBS_INDS, HEARTS_INDS, DMDS_INDS]

ind2Name = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '', '', '', '', 'Q', 'K', 'A']

SUIT_LIST = ['SPADES', 'CLUBS', 'HEARTS', 'DIAMONDS']

SPADE_ASCII = "\u2660"
CLUB_ASCII = "\u2663"
HEART_ASCII = "\u2665"
DMD_ASCII = "\u2666"

SPADE_INDS_PTS  = [ 0,  1,  8, 52, 53, 22,  9, 12]
CLUBS_INDS_PTS  = [13, 14, 21, 52, 53,  9, 22, 25]
HEARTS_INDS_PTS = [26, 27, 34, 52, 53, 48, 35, 38]
DMDS_INDS_PTS   = [39, 40, 47, 52, 53, 35, 48, 51]

POINT_VALUES    = [1, 3, 1, 1, 1, 1, 1, 1]

inFile = open("inFile4TestScaled.txt", "w")
outFile = open("outFile4TestScaled.txt", "w")

def shuffleDeck():
    deck = []
    shuffled_deck = []
    for i in range(54):
        deck.append(i)
    for i in range(54):
        rand = random.randint(0, len(deck) - 1)
        shuffled_deck.append(deck.pop(rand))
    return shuffled_deck

# input vector
# 54 (starting cards), 16 (cards 2nd phase), 16 (other cards phase 2), 16 team card played, 32: 2 other team cards played, currBid, teamHasBid, otherTeamHasBid, myPoints, theirPoints, myInd

# 1 (bid), 4 (suit), 16 (cards played)

def simGame():
    deck = shuffleDeck()

    outputVecs = [[],[],[],[]]
    inputVecs = [[],[],[],[]]

    hand1 = []
    hand2 = []
    hand3 = []
    hand4 = []

    hands = [hand1, hand2, hand3, hand4]

    # Deal cards
    for i in range(9):
        hand1.append(deck.pop(0))
        hand2.append(deck.pop(0))
        hand3.append(deck.pop(0))
        hand4.append(deck.pop(0))

    # HAND PRINTS
    if VERBOSE:
        print("Hand 1 Dealt: " + str(hand2String(hand1)))
        print("Hand 2 Dealt: " + str(hand2String(hand2)))
        print("Hand 3 Dealt: " + str(hand2String(hand3)))
        print("Hand 4 Dealt: " + str(hand2String(hand4)))

    def bidRound(team1Pts, team2Pts, leftOfDealer):

        def genBidInputVect(currBid, whoHadBid, hand, myPoints, theirPoints, myInd, j):

            # 1x57 array of zeros
            inputVec = np.zeros(BID_INPUT_VEC_SIZE)

            # 1:54 init to -1.
            # -1 means I DONT have this card
            # 1 means 1 DO have this card
            for i in range(54):
                inputVec[i] = -1

            for i in range(9):
                inputVec[hand[i]] = 1

            # 0 means no info
            if currBid == -1:
                inputVec[BID_CURR_BID_IND] = 0
                inputVec[BID_TEAM_HAS_BID_IND] = 0
                inputVec[BID_OTHER_TEAM_HAS_BID_IND] = 0
                
            else:
                teamHasBid = 1
                otherTeamHasBid = 1
                if myInd == 3:
                    if whoHadBid == 1:
                        teamHasBid = 1
                        otherTeamHasBid = -1
                    else:
                        teamHasBid = -1
                        otherTeamHasBid = 1
                if myInd == 2:
                    if whoHadBid == 0:
                        teamHasBid = 1
                        otherTeamHasBid = -1
                    else:
                        teamHasBid = -1
                        otherTeamHasBid = 1
                if myInd == 1:
                    teamHasBid = -1
                    otherTeamHasBid = 1

                inputVec[BID_CURR_BID_IND] = currBid / 10.0
                inputVec[BID_OTHER_TEAM_HAS_BID_IND] = otherTeamHasBid
                inputVec[BID_TEAM_HAS_BID_IND] = teamHasBid
            
            return inputVec

        whoHadBid = -1
        currBid = -1
        suit = 0

        for bidNum in range(4):
            # j should be seat number
            j = (bidNum + leftOfDealer) % 4
            # create input vector for neural network
            inputVec = genBidInputVect(currBid, whoHadBid, hands[j], team1Pts, team2Pts, bidNum, j)
            
            inputVecArr = np.array(inputVec, dtype='float32')
            inputVecArr = np.reshape(inputVecArr, (1, BID_INPUT_VEC_SIZE))
            # generate random decisions 
            # outVecGen = np.random.rand(OUT_VEC_SIZE)
            # predict decisions
           
            # Set up your input data.

            # # Invoke the model on the input data
            # interpreterB.set_tensor(input_detailsB[0]['index'], inputVecArr)
            # interpreterB.invoke()

            # # Get the result 
            # outVecGen = interpreterB.get_tensor(output_detailsB[0]['index'])
            # outVecGen = outVecGen[0]

            # find highest value in bid indices
            # not allowing moon shooting rn
            # decision = np.argmax(outVecGen[:7]) + 4
            # suitDec = np.argmax(outVecGen[7:11]) + 1
            outVecEval = np.zeros(BID_OUT_VEC_SIZE)

            # use contrived alg
            [decision, suitDec] = evalHand(hands[j])
            
            noChoice = False
            # no choice, must take the bid at min bid
            if bidNum == 3 and currBid == -1:
                currBid = MIN_BID

                # seat number 
                whoHadBid = j

                # get suit from output vector
                # suit = np.argmax(outVecGen[8:12]) + 1
                suit = suitDec

                # generate training output vector
                noChoice = True

            elif decision > currBid and decision > MIN_BID:
                currBid = decision
                whoHadBid = j
                suit = suitDec
                # suit = np.argmax(outVecGen[8:12]) + 1
                outVecEval[decision - 4] = 1
                outVecEval[suit + BID_SUIT_START - 1] = 1
            else:
                # passed
                outVecEval[0] = 1

            # Don't train off data where no decision was made
            if not noChoice:
                inputVecs[j].append(inputVec)
                outputVecs[j].append(outVecEval)
        
        return [currBid, whoHadBid, suit]

    def playGame(bid, whoHasBid, suit, hands, team1Pts, team2Pts):
        allCardsPlayed = []
        suit_inds = [SPADE_INDS, CLUBS_INDS, HEARTS_INDS, DMDS_INDS]
        suit_inds_pts = [SPADE_INDS_PTS, CLUBS_INDS_PTS, HEARTS_INDS_PTS, DMDS_INDS_PTS]

        def discardUnsuited(suit, hand):
            remList = []
            for card in hand: 
                if card not in suit_inds[suit - 1]:
                    remList.append(card)
            for discard in remList:
                hand.remove(discard)

        def discardSuited(suit, hand):
            while (len(hand) > 6):
                remList = []
                minCard = 100
                for card in hand: 
                    if card not in suit_inds_pts[suit - 1] and card < minCard:
                        minCard = card
                if minCard == 100:
                    return 0
                hand.remove(minCard)
            return 1

        def fillHand(hand):
            for i in range(6 - len(hand)):
                if deck == []:
                    return 0
                hand.append(deck.pop(0))
            return 1
        
        def fillWithDeck(suit, hand):
            for card in deck:
                if card in suit_inds[suit - 1]:
                    popCard(suit, hand)
                    hand.append(card)

        def popCard(suit, hand):
            for card in hand:
                if card not in suit_inds[suit - 1]:
                    hand.remove(card)
                    break

            if len(hand) == 6:
                non_pts = []
                for card in hand:
                    if card not in suit_inds_pts[suit - 1]:
                        non_pts.append(card)
                if len(non_pts) == 0:
                    return 0
                else:
                    hand.remove(np.min(non_pts))
        
        def genRoundInputVect(currBid, whoHadBid, hand, team1Pts, team2Pts, team1PtsThisRound, team2PtsThisRound, myInd, j, suit, cardsPlayed, cardsPlayedThisRound):
            inputVec = np.zeros(INPUT_VEC_SIZE)

            for i in range(TEAM_CARD_IND_START):
                inputVec[i] = -1

            for i in range(OTHER_CARD_1_IND_START, OTHER_CARD_1_IND_START + 16):
                inputVec[i] = -1

            for i in range(OTHER_CARD_2_IND_START, OTHER_CARD_2_IND_START + 16):
                inputVec[i] = -1

            for i in range(TEAM_CARD_IND_START, TEAM_CARD_IND_START + 16):
                inputVec[i] = -1

            for i in range(len(hand)):
                if hand[i] in suit_inds[suit - 1]:
                    inputVec[suit_inds[suit - 1].index(hand[i])] = 1

            for i in range(len(suit_inds[suit - 1])):
                if suit_inds[suit - 1][i] not in cardsPlayed and suit_inds[suit - 1][i] not in hand:
                    inputVec[i + 16] = 1

            if len(cardsPlayedThisRound) == 1:
                if cardsPlayedThisRound[0] != -1:
                    inputVec[OTHER_CARD_1_IND_START + suit_inds[suit - 1].index(cardsPlayedThisRound[0])] = 1

            if len(cardsPlayedThisRound) == 2:
                if cardsPlayedThisRound[0] != -1:
                    inputVec[TEAM_CARD_IND_START + suit_inds[suit - 1].index(cardsPlayedThisRound[0])] = 1
                if cardsPlayedThisRound[1] != -1:
                    inputVec[OTHER_CARD_1_IND_START + suit_inds[suit - 1].index(cardsPlayedThisRound[1])] = 1

            if len(cardsPlayedThisRound) == 3:
                if cardsPlayedThisRound[0] != -1:
                    inputVec[OTHER_CARD_1_IND_START + suit_inds[suit - 1].index(cardsPlayedThisRound[0])] = 1
                if cardsPlayedThisRound[1] != -1:
                    inputVec[TEAM_CARD_IND_START + suit_inds[suit - 1].index(cardsPlayedThisRound[1])] = 1
                if cardsPlayedThisRound[2] != -1:
                    inputVec[OTHER_CARD_2_IND_START + suit_inds[suit - 1].index(cardsPlayedThisRound[2])] = 1

            teamHasBid = 1
            otherTeamHasBid = 1
            if myInd == 1 or myInd == 3:
                if whoHadBid == 1 or whoHadBid == 3:
                    teamHasBid = 1
                    otherTeamHasBid = -1
                else:
                    teamHasBid = -1
                    otherTeamHasBid = 1
            if myInd == 2 or myInd == 0:
                if whoHadBid == 0 or whoHadBid == 2:
                    teamHasBid = 1
                    otherTeamHasBid = -1
                else:
                    teamHasBid = -1
                    otherTeamHasBid = 1

            inputVec[OTHER_TEAM_HAS_BID_IND] = otherTeamHasBid
            inputVec[TEAM_HAS_BID_IND] = teamHasBid
            inputVec[CURR_BID_IND] = currBid/10.0

            if j == 0 or j == 2:
                myPoints = team1Pts
                theirPoints = team2Pts
                myPointsThisRound = team1PtsThisRound
                theirPointsThisRound = team2PtsThisRound
            else:
                myPoints = team2Pts
                theirPoints = team1Pts
                myPointsThisRound = team2PtsThisRound
                theirPointsThisRound = team1PtsThisRound

            inputVec[MY_PTS_IND] = myPoints/10.0
            inputVec[THEIR_PTS_IND] = theirPoints/10.0
            inputVec[MY_PTS_ROUND_IND] = myPointsThisRound/10.0
            inputVec[THEIR_PTS_ROUND_IND] = theirPointsThisRound/10.0
            # inputVecs[j].append(inputVec)
            return inputVec

        def playRound(suit, hands, lead, team1PtsThisRound, team2PtsThisRound):

            playedCards = []

            for playNum in range(len(hands)):

                hand = hands[(playNum + lead) % 4]

                noChoice = False
                
                playableCards = 0
                for card in suit_inds[suit - 1]:
                    if card in hand:
                        playableCards += 1
                
                if playableCards == 0:
                    playedCards.append(-1)
                    continue

                noChoice = True

                inputVec = genRoundInputVect(bid, whoHasBid, hand, 0, 0, team1PtsThisRound, team2PtsThisRound, playNum, (playNum + lead)%4, suit, allCardsPlayed, playedCards)
                inputVecArr = np.array(inputVec, dtype='float32')
                inputVecArr = np.reshape(inputVecArr, (1, INPUT_VEC_SIZE))

                # outVecGen = np.random.rand(OUT_VEC_SIZE)

                # Set up your input data.

                # Invoke the model on the input data
                interpreterR.set_tensor(input_detailsR[0]['index'], inputVecArr)
                interpreterR.invoke()

                # Get the result 
                outVecGen = interpreterR.get_tensor(output_detailsR[0]['index'])
                outVecGen = outVecGen[0]

                playCard = -1
                playCardInd = -1

                if not len(np.intersect1d(suit_inds[suit - 1], hand)) == 0:
                    while playCard < 0:
                        playCardInd = np.argmax(outVecGen)
                        cardMapped = suit_inds[suit - 1][playCardInd]
                        if cardMapped in hand:
                            playCard = cardMapped
                        else:
                            outVecGen[playCardInd] = -np.infty
                    hand.remove(playCard)

                    outVecEval = np.zeros(OUT_VEC_SIZE)
                    outVecEval[playCardInd] = 1
                    # outputVecs[(playNum + lead)%4].append(outVecEval)
                playedCards.append(playCard)
                allCardsPlayed.append(playCard)
                

            playedCardValues = []
            team1 = [(0 + lead)%4, (2 + lead)%4]
            team2 = [(1 + lead)%4, (3 + lead)%4]
            team1Sum = 0
            team2Sum = 0
            lumpSum = 0
            for playerIdx, card in enumerate(playedCards):
                if VERBOSE:
                    print("Played Card: " + numToCardName(card))
                if card == -1:
                    playedCardValues.append(-1)
                else:
                    playedCardValues.append(suit_inds[suit - 1].index(card))

                    # Free point.
                    if suit_inds[suit - 1].index(card) == 0:
                        if playerIdx in team1:
                            team1Sum += 1
                        else:
                            team2Sum += 1
                    elif card in suit_inds_pts[suit - 1]:
                        lumpSum += POINT_VALUES[suit_inds_pts[suit - 1].index(card)]

            winnerIdx = np.argmax(playedCardValues)
            if winnerIdx in team1:
                team1Sum += lumpSum
            else:
                team2Sum += lumpSum

            newLead = (winnerIdx + lead) % 4

            return [newLead, team1Sum, team2Sum]

        def evaluateWin(bid, whoHasBid, team1Pts, team2Pts):
            
            total1 = 0
            total2 = 0

            if whoHasBid == 0 or whoHasBid == 2:
                if team1Pts >= bid:
                    total1 = team1Pts
                else:
                    total1 = -bid
                total2 = team2Pts
            else:
                if team2Pts >= bid:
                    total2 = team2Pts
                else:
                    total2 = -bid
                total1 = team1Pts
            return [total1, total2]

        discardedCorrectly = 1
        for hand in hands:
            discardUnsuited(suit, hand)
            if (len(hand) > 6):
                discardedCorrectly = discardSuited(suit, hand)

        if not discardedCorrectly:
            return 0

        for hand in hands:
            filledCorrectly = fillHand(hand)

        if not filledCorrectly:
            return 0

        team1Total = 0
        team2Total = 0
        fillWithDeck(suit, hands[0])
                
        if VERBOSE:
            print("Hand 1 Filled: " + str(hand2String(hands[0])))
            print("Hand 2 Filled: " + str(hand2String(hands[1])))
            print("Hand 3 Filled: " + str(hand2String(hands[2])))
            print("Hand 4 Filled: " + str(hand2String(hands[3])))

            print("----------ROUND 1------------")
        roundRet = playRound(suit, hands, whoHasBid, 0, 0)
        newLead = roundRet[0]
        team1Pts = roundRet[1]
        team2Pts = roundRet[2]
        team1Total += team1Pts
        team2Total += team2Pts

        if VERBOSE:
            print("New Lead: " + str(newLead))
            print("Team 1 Points: " + str(team1Pts))
            print("Team 2 Points: " + str(team2Pts))
            print("-----------------------------")

            print("----------ROUND 2------------")
        roundRet = playRound(suit, hands, newLead, team1Total, team2Total)
        newLead = roundRet[0]
        team1Pts = roundRet[1]
        team2Pts = roundRet[2]
        team1Total += team1Pts
        team2Total += team2Pts

        if VERBOSE:
            print("New Lead: " + str(newLead))
            print("Team 1 Points: " + str(team1Pts))
            print("Team 2 Points: " + str(team2Pts))
            print("-----------------------------")

            print("----------ROUND 3------------")
        roundRet = playRound(suit, hands, newLead, team1Total, team2Total)
        newLead = roundRet[0]
        team1Pts = roundRet[1]
        team2Pts = roundRet[2]
        team1Total += team1Pts
        team2Total += team2Pts

        if VERBOSE:
            print("New Lead: " + str(newLead))
            print("Team 1 Points: " + str(team1Pts))
            print("Team 2 Points: " + str(team2Pts))
            print("-----------------------------")

            print("----------ROUND4------------")
        roundRet = playRound(suit, hands, newLead, team1Total, team2Total)
        newLead = roundRet[0]
        team1Pts = roundRet[1]
        team2Pts = roundRet[2]
        team1Total += team1Pts
        team2Total += team2Pts

        if VERBOSE:
            print("New Lead: " + str(newLead))
            print("Team 1 Points: " + str(team1Pts))
            print("Team 2 Points: " + str(team2Pts))
            print("-----------------------------")

            print("----------ROUND 5------------")
        roundRet = playRound(suit, hands, newLead, team1Total, team2Total)
        newLead = roundRet[0]
        team1Pts = roundRet[1]
        team2Pts = roundRet[2]
        team1Total += team1Pts
        team2Total += team2Pts

        if VERBOSE:
            print("New Lead: " + str(newLead))
            print("Team 1 Points: " + str(team1Pts))
            print("Team 2 Points: " + str(team2Pts))
            print("-----------------------------")

            print("----------ROUND 6------------")
        roundRet = playRound(suit, hands, newLead, team1Total, team2Total)
        newLead = roundRet[0]
        team1Pts = roundRet[1]
        team2Pts = roundRet[2]
        team1Total += team1Pts
        team2Total += team2Pts

        if VERBOSE:
            print("New Lead: " + str(newLead))
            print("Team 1 Points: " + str(team1Pts))
            print("Team 2 Points: " + str(team2Pts))
            print("-----------------------------")

        winRet = evaluateWin(bid, whoHasBid, team1Total, team2Total)

        return winRet
                

    team1Pts = 0
    team2Pts = 0
    bidRet = bidRound(team1Pts, team2Pts, 0)
    currBid = bidRet[0]
    whoHasBid = bidRet[1]
    suit = bidRet[2]

    if VERBOSE:
        # VERBOSE BID PRINTS
        print("Bid: " + str(currBid))
        print("Suit: " + SUIT_LIST[suit - 1])
        print("Bid Winner: " + str(whoHasBid))

    winRet = playGame(currBid, whoHasBid, suit, hands, 0, 0)

    if winRet == 0:
        return
    if VERBOSE:
        print("Team 1 Total Points: " + str(winRet[0]))
        print("Team 2 Total Points: " + str(winRet[1]))

    for i in range(len(inputVecs)):
        for j in range(len(inputVecs[i])):
            for k in range(len(inputVecs[i][j])):
                inFile.write(str(inputVecs[i][j][k]))
                if k < len(inputVecs[i][j]) - 1:
                    inFile.write(", ")
                else:
                    inFile.write("\n")

    for i in range(len(outputVecs)):
        for j in range(len(outputVecs[i])):
            if i == 0 or i == 2:
                multi = winRet[0]
            else:
                multi = winRet[1]

            # dont punish negatives?
            # if multi < 0:
            #     if winRet[0] < 0:
            #         multi = 10 - winRet[1]
            #     else:
            #         multi = 10 - winRet[0]

            outputVecs[i][j] *= (multi/10)
            
            for k in range(len(outputVecs[i][j])):
                outFile.write(str(outputVecs[i][j][k]))
                if k < len(outputVecs[i][j]) - 1:
                    outFile.write(", ")
                else:
                    outFile.write("\n")

    return (winRet[0] + winRet[1]) / 2

def numToCardName(num):
    if num == -1:
        cardName = '-1' 

    elif num == 52 or num == 53:
        cardName = 'Joker'

    elif num == 22:
        cardName = 'J' + CLUB_ASCII

    elif num == 9:
        cardName = 'J' + SPADE_ASCII

    elif num == 48:
        cardName = 'J' + DMD_ASCII

    elif num == 35:
        cardName = 'J' + HEART_ASCII

    elif num in SPADE_INDS:
        cardNumVal = SPADE_INDS.index(num)
        cardName = ind2Name[SPADE_INDS.index(num)] + SPADE_ASCII

    elif num in CLUBS_INDS:
        cardNumVal = CLUBS_INDS.index(num)
        cardName = ind2Name[CLUBS_INDS.index(num)] + CLUB_ASCII

    elif num in HEARTS_INDS:
        cardNumVal = HEARTS_INDS.index(num)
        cardName = ind2Name[HEARTS_INDS.index(num)] + HEART_ASCII
    
    elif num in DMDS_INDS:
        cardNumVal = DMDS_INDS.index(num)
        cardName = ind2Name[DMDS_INDS.index(num)] + DMD_ASCII

    return cardName

def hand2String(hand):
    handString = []
    for i in range(len(hand)):
        handString.append(numToCardName(hand[i]))

    return handString

def evalHand(hand):
    cardWeights = [1, 1.25, 0.2, 0.2, 0.2, 0.3, 0.3, 0.3, 0.8, 1, 1, 1.25, 1.4, 1.75, 2, 2.5]
    maxScore = 0
    suit = 0
    for i in range(len(SUIT_INDS_LIST)):
        score = 0
        for card in hand:
            if card in SUIT_INDS_LIST[i]:
                score += cardWeights[SUIT_INDS_LIST[i].index(card)]
        if score > maxScore:
            maxScore = int(np.round(score))
            suit = i + 1

    return [np.minimum(maxScore + 1, 10), suit]



masterAvgScore = 0
i = 0
while i < numTotalGames:
    avgScore = simGame()
    if avgScore == None:
        continue
    masterAvgScore = (masterAvgScore*i + avgScore)/(i+1)
    if i % 1000 == 0:
        print("Finished Game: " + str(i))
        print("Avg Score: " + str(masterAvgScore))
                # np.savetxt(inFile, inputVec.reshape(1, inputVec.shape[0]), delimiter = ',', fmt = '%.0f')
    i += 1
#