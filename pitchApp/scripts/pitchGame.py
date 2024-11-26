import random

class pitchGame:
    hands = [[],[],[],[]]
    deck = []
    dealer = 0
    team1Score = 0
    team2Score = 0
    maxScore = 51
    lastBidTeam = 0
    bid = 0
    minBid = 4

    def __init__(self):
        self.reloadDeck()
    
    def reloadDeck(self):
        self.deck = []
        for i in range(54):
            self.deck.append(i + 1)

    def shuffle(self):
        shuffled_deck = []
        for i in range(54):
            rand = random.randint(0, len(self.deck) - 1)
            shuffled_deck.append(self.deck.pop(rand))    
        self.deck = shuffled_deck

    def deal(self):
        for i in range(9):
            for j in range(len(self.hands)):
                self.hands[j].append(self.deck.pop(0))

    def gameWon(self):
        if self.team1Score >= self.maxScore and self.lastBidTeam == 1:
            return 1
        if self.team2Score >= self.maxScore and self.lastBidTeam == 2:
            return 2
        return 0
                

            




# pg = pitchGame()
# pg.shuffle()
# pg.deal()

# for i in range(9):
#     print(str(pg.hands[0][i]) + "\n")