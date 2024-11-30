from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup as soup
import re
import unicodedata

my_url = 'https://www.baseball-reference.com/players/'

namefile = open("C:\\Users\\natha\\baseball-card-app\\baseballscraper\\baseballnames.txt","w",encoding="utf8")
hoffile = open("C:\\Users\\natha\\baseball-card-app\\baseballscraper\\hofnames.txt","w",encoding="utf8")
letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "y", "z"]

def strip_accents(text):

    try:
        text = unicode(text, 'utf-8')
    except NameError: # unicode is a default on python 3 
        pass

    text = unicodedata.normalize('NFD', text)\
           .encode('ascii', 'ignore')\
           .decode("utf-8")

    return str(text)

y = 0
while (y<len(letters)):
    actual_url = my_url + letters[y]
    #open connection, grabbing page
    uClient = uReq(actual_url)
    page_html = uClient.read()
    uClient.close()

    page_soup = soup(page_html, "html.parser")

    ps = page_soup.find(id="div_players_")

    names = ps.findAll("a")
    pars = ps.findAll("p")

    x = 0
    while (x<len(names)):
        name = strip_accents(names[x].string)
        namefile.write(name)
        namefile.write("\n")
        x+=1
    x = 0
    while (x<len(pars)):
        if "+" in pars[x].text:
            name = strip_accents(names[x].string)
            hoffile.write(name)
            hoffile.write("\n")
        x+=1
    y+=1