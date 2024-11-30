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
import os

readfile = open(os.path.join(os.path.dirname(__file__), '..', 'baseballnames.txt'),"r")

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

def get_pictures():
    cardsgrabbed = 217060
    y = 4065
    while(y<len(names)):
        print("on player: " + str(y))
        uClient = uReq(get_url(names[y]))
        page_html = uClient.read()
        uClient.close()
        
        product = SoupStrainer('div',{'class': 'card-body'})
        card = soup(page_html, "lxml", parse_only=product)
        try:
            playerurl = "https://www.tcdb.com" + card.a["href"]
        except:
            print("skipped " + str(y))
            y+=1
            continue

        try:
            uClient = uReq(playerurl)
            page_html = uClient.read()
            uClient.close()
        except:
            print("skipped " + str(y))
            y+=1
            continue

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
            print("skipped " + str(y))
            y+=1
            continue

        x = 1
        first = True
        totalpages = math.ceil(totalcards/50.0)
        while (x <= totalpages):
            if (first):
                loc = moreurl.find("sTeam")
                moreurl = moreurl[:loc] + "PageIndex=" + "1" + "&" + moreurl[loc:]
                first = False

            else:
                moreurl = moreurl.replace("dex=" + str(x - 1), "dex=" + str(x))
            
            try:
                uClient = uReq(moreurl)
                cardlistpage = uClient.read()
                uClient.close()
            except:
                x+=1
                continue

            cardlistpage_soup = soup(cardlistpage, "lxml")
            cards = cardlistpage_soup.findAll("tr")

            numonpagetotal = 50
            if(x == totalpages):
                numonpagetotal = totalcards%50
            z = 0
            while(z < numonpagetotal):
                cardindex = z + 3
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

                try:
                    urllib.request.urlretrieve("https://www.tcdb.com" + frontimage, os.path.join(os.path.dirname(__file__), '..', '..', 'CardImages', 'Fronts', str(cardsgrabbed) + ".jpg"))
                    urllib.request.urlretrieve("https://www.tcdb.com" + backimage, os.path.join(os.path.dirname(__file__), '..', '..', 'CardImages', 'Backs', str(cardsgrabbed) + ".jpg"))

                except:
                    z+=1
                    continue
                imgfront = Image.open(os.path.join(os.path.dirname(__file__), '..', '..', 'CardImages', 'Fronts', str(cardsgrabbed) + ".jpg"))
                imgback = Image.open(os.path.join(os.path.dirname(__file__), '..', '..', 'CardImages', 'Backs', str(cardsgrabbed) + ".jpg"))
                
                if(imgback.width > imgback.height):
                    imgback.transpose(Image.ROTATE_90).save(os.path.join(os.path.dirname(__file__), '..', '..', 'CardImages', 'Backs', str(cardsgrabbed) + ".jpg"), subsampling =0, quality=100)
                if(imgfront.width > imgfront.height):    
                    imgfront.transpose(Image.ROTATE_90).save(os.path.join(os.path.dirname(__file__), '..', '..', 'CardImages', 'Fronts', str(cardsgrabbed) + ".jpg"), subsampling=0, quality=100)
                
                with open(os.path.join(os.path.dirname(__file__), '..', '..', 'CardImages', 'CardsListDynamic.txt'), "a") as writefile:
                    writefile.write(str(cardsgrabbed))
                    writefile.write("\t")
                    writefile.write(cards[cardindex].find("td", {"class": "vertical"}).a.text)
                    writefile.write("\n")

                z+=1
                cardsgrabbed+=1
            x+=1
        y+=1

get_pictures()