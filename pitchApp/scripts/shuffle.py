deck = []
shuffled_deck = []
import random

for i in range(54):
    deck.append(i + 1)

for i in range(54):
    rand = random.randint(0, len(deck) - 1)
    shuffled_deck.append(deck.pop(rand))

for i in range(54):
    print(str(shuffled_deck[i]) + "\n")