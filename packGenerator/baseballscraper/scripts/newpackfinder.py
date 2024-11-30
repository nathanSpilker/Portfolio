from random import randint
from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup as soup
import math
import urllib.request
import random
import time
from bs4 import SoupStrainer
import re
from PIL import Image
import json

readfile = open("C:\\Users\\natha\\baseball-card-app\\baseballscraper\\baseballnames.txt","r")

names = []

content = readfile.readline()
x = 0
while(content != ""):
    names.append(content)
    content = readfile.readline()
    x+=1
readfile.close()



def get_url(name):
    name = name.split(" ")
    name[-1] = name[-1][:-1]
    url = "https://www.tcdb.com/Search.cfm?SearchCategory=Baseball&cx=partner-pub-2387250451295121%3Ahes0ib-44xp&cof=FORID%3A10&ie=ISO-8859-1&q="
    z = 0
    while (z < len(name)):
        url+=name[z]
        if (z + 1 < len(name)):
            url+="+"
        z+=1
    url+="&siteurl=https%3A%2F%2Fwww.tcdb.com%2FPerson.cfm%2Fpid%2F114%2Fcol%2F1%2Fyea%2F0%2FWayne-Ambler%3FsTeam%3D%26sCardNum%3D%26sNote%3D%26sSetName%3D%26sBrand%3D"
    return(url) 

def get_pack(size):
    cardsgrabbed = 0
    y = 0
    pack = []
    jsoncards = []
    while(y<size):
        uClient = uReq(get_url(names[randint(0, len(names) - 1)]))
        page_html = uClient.read()
        uClient.close()
        
        product = SoupStrainer('div',{'class': 'card-body'})
        card = soup(page_html, "lxml", parse_only=product)
        try:
            playerurl = "https://www.tcdb.com" + card.a["href"]
        except:
            continue

        uClient = uReq(playerurl)
        page_html = uClient.read()
        uClient.close()

        product = SoupStrainer('div',{'class': 'more'})
        card = soup(page_html, "lxml", parse_only=product)
        moreurl = "https://www.tcdb.com" + card.a["href"]

        product = SoupStrainer('div',{'class': 'col-sm-8'})
        snippet = soup(page_html, "lxml", parse_only=product)
        smallersnip = snippet.findAll("p")
        
        try:
            if "(" in smallersnip[-1].text:
                totalcards = int(smallersnip[-2].text.split()[-1].replace(",", ""))
            else:
                totalcards = int(smallersnip[-1].text.split()[-1].replace(",", ""))
        except:
            continue

        totalpages = math.ceil(totalcards/50.0)
        page = randint(1, totalpages)
        loc = moreurl.find("sTeam")
        moreurl = moreurl[:loc] + "PageIndex=" + str(page) + "&" + moreurl[loc:]

        uClient = uReq(moreurl)
        cardlistpage = uClient.read()
        uClient.close()
            
        cardlistpage_soup = soup(cardlistpage, "lxml")
        cards = cardlistpage_soup.findAll("tr")

        numonpagetotal = 50
        if(x == totalpages):
            numonpagetotal = totalcards%50
        firsttry = randint(0, numonpagetotal - 1)
        z = 0
        while(z < numonpagetotal):
            cardindex = firsttry + z + 3
            cardindex = cardindex%50
            try:
                if cards[cardindex].a.img["data-original"] == "/Images/AddCard2.gif":
                    z+=1
                    continue
                
                imglink = "https://www.tcdb.com" + cards[cardindex].a["href"]
                uClient = uReq(imglink)
                page_html = uClient.read()
                uClient.close()

            except:
                z+=1
                continue

            product = SoupStrainer('div',{'class': 'col-sm-6'})
            snippet = soup(page_html, "lxml", parse_only=product)
            
            frontimage = ""
            backimage = ""
            try:
                imgs = snippet.findAll("img")
                frontimage = (imgs[0]["src"])
                backimage = (imgs[1]["src"])
            except:
                z+=1
                continue

            pack.append(cards[cardindex].find("td", {"class": "vertical"}).a.text)
            jsoncards.append({'name': pack[-1], 'picture': str(cardsgrabbed)})
                
            urllib.request.urlretrieve("https://www.tcdb.com" + frontimage, "C:\\Users\\natha\\baseball-card-app\\baseballscraper\\TemporaryImages\\" + str(cardsgrabbed) + "FRONT" + ".jpg")
            urllib.request.urlretrieve("https://www.tcdb.com" + backimage, "C:\\Users\\natha\\baseball-card-app\\baseballscraper\\TemporaryImages\\" + str(cardsgrabbed) + "BACK" +".jpg")

            imgfront = Image.open("C:\\Users\\natha\\baseball-card-app\\baseballscraper\\TemporaryImages\\" + str(cardsgrabbed) + "FRONT" + ".jpg")
            imgback = Image.open("C:\\Users\\natha\\baseball-card-app\\baseballscraper\\TemporaryImages\\" + str(cardsgrabbed) + "BACK" + ".jpg")
            
            if(imgback.width > imgback.height):
                imgback.transpose(Image.ROTATE_90).save("C:\\Users\\natha\\baseball-card-app\\baseballscraper\\TemporaryImages\\" + str(cardsgrabbed) + "BACK" + ".jpg", subsampling =0, quality=100)
            if(imgfront.width > imgfront.height):    
                imgfront.transpose(Image.ROTATE_90).save("C:\\Users\\natha\\baseball-card-app\\baseballscraper\\TemporaryImages\\" + str(cardsgrabbed) + "FRONT" + ".jpg", subsampling=0, quality=100)
            cardsgrabbed+=1
            break
        y+=1
    return jsoncards
start = time.time()
jsoncards = get_pack(5)
end = time.time()
print(end - start)
with open("C:\\Users\\natha\\baseball-card-app\\baseballscraper\\TemporaryImages\\TempCards.json", "w") as writefile:
    json.dump(jsoncards, writefile, sort_keys=False, indent=4)