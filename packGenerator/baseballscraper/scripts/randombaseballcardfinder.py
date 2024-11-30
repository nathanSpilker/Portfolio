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
hoffile = open("C:\\Users\\natha\\baseball-card-app\\baseballscraper\\hofnames.txt","r")

names = []
hofnames = []
content = readfile.readline()
hofcontent = hoffile.readline()

x = 0
while(content != ""):
    names.append(content)
    content = readfile.readline()
    x+=1

x = 0
while(hofcontent != ""):
    hofnames.append(hofcontent)
    hofcontent = hoffile.readline()
    x+=1

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

def get_card(url):
    uClient = uReq(url)
    page_html = uClient.read()
    uClient.close()
    page_soup = soup(page_html, "html.parser")
    card = page_soup.find("div", {"class": "card-body"})
    try:
        playerurl = "https://www.tcdb.com" + card.a["href"]
    except:
        return("")

    uClient = uReq(playerurl)
    page_html = uClient.read()
    uClient.close()
    page_soup = soup(page_html, "html.parser")
    card = page_soup.find("div", {"class": "more"})
    moreurl = "https://www.tcdb.com" + card.a["href"]

    totalcards = int(page_soup.find("div", {"class": "col-sm-8"}).findAll("p")[-1].text.split()[-1])
    lastpage = 1

    w = 0
    randorder = []
    while (w < totalcards):
        randorder.append(w)
        w+=1
    random.shuffle(randorder)

    x = 0
    first = True
    while (x < totalcards):
        cardtry = randorder[x]
        pagetry = math.ceil(cardtry/50.0)
        numberonpage = cardtry - (pagetry - 1)*50
        if (first):
            loc = moreurl.find("sTeam")
            moreurl = moreurl[:loc] + "PageIndex=" + str(pagetry) + "&" + moreurl[loc:]
            first = False
        elif(lastpage != pagetry):
            moreurl.replace("PageIndex=" + str(lastpage), "PageIndex=" + str(pagetry))
        lastpage = pagetry
        
        uClient = uReq(moreurl)
        page_html = uClient.read()
        uClient.close()
        page_soup = soup(page_html, "html.parser")
        cards = page_soup.findAll("tr")

        cardindex = numberonpage + 2

        imgs = cards[cardindex].findAll("img", {"class": "lazy img-fluid"})
        frontimage = (imgs[0]["data-original"])
        backimage = (imgs[1]["data-original"])

        if((frontimage == "/Images/AddCard2.gif") or (backimage == "/Images/AddCard2.gif")):
            x+=1

        else:
            urllib.request.urlretrieve("https://www.tcdb.com" + frontimage, "frontimage.jpg")
            urllib.request.urlretrieve("https://www.tcdb.com" + backimage, "backimage.jpg")
            cardname = cards[cardindex].find("td", {"class": "vertical"}).a.text
            return(cardname)
    
    return("")

def get_pack(size):
    cardnames = []
    y = 0
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
        lastpage = 1

        x = 0
        first = True
        tries = min(20, totalcards)
        while (x < tries):
            cardtry = randint(1, totalcards)
            pagetry = math.ceil(cardtry/50.0)
            numberonpage = cardtry - (pagetry - 1)*50
            if (first):
                loc = moreurl.find("sTeam")
                moreurl = moreurl[:loc] + "PageIndex=" + str(pagetry) + "&" + moreurl[loc:]
                first = False
            elif(lastpage != pagetry):
                moreurl.replace("PageIndex=" + str(lastpage), "PageIndex=" + str(pagetry))
            lastpage = pagetry
            
            uClient = uReq(moreurl)
            page_html = uClient.read()
            uClient.close()
            
            page_soup = soup(page_html, "html.parser")
            cards = page_soup.findAll("tr")

            cardindex = numberonpage + 2

            try:
                imglink = "https://www.tcdb.com" + cards[cardindex].a["href"]
                uClient = uReq(imglink)
                page_html = uClient.read()
                uClient.close()

            except:
                x+=1
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
                x+=1
                continue

            

            if((frontimage == "/Images/DefaultFront.gif") or (backimage == "/Images/DefaultBack.gif")):
                x+=1

            else:
                urllib.request.urlretrieve("https://www.tcdb.com" + frontimage, "C:\\Users\\natha\\baseball-card-app\\src\\components\\CardBar\\frontimage" + str(y) + ".jpg")
                urllib.request.urlretrieve("https://www.tcdb.com" + backimage, "C:\\Users\\natha\\baseball-card-app\\src\\components\\CardBar\\backimage" + str(y) + ".jpg")
                cardnames.append(cards[cardindex].find("td", {"class": "vertical"}).a.text)
                
                imgfront = Image.open("C:\\Users\\natha\\baseball-card-app\\src\\components\\CardBar\\frontimage" + str(y) + ".jpg")
                imgback = Image.open("C:\\Users\\natha\\baseball-card-app\\src\\components\\CardBar\\backimage" + str(y) + ".jpg")
                
                if(imgback.width > imgback.height):
                    imgback.transpose(Image.ROTATE_90).save("C:\\Users\\natha\\baseball-card-app\\src\\components\\CardBar\\backimage" + str(y) + ".jpg", subsampling =0, quality=100)
                if(imgfront.width > imgfront.height):    
                    imgfront.transpose(Image.ROTATE_90).save("C:\\Users\\natha\\baseball-card-app\\src\\components\\CardBar\\frontimage" + str(y) + ".jpg", subsampling=0, quality=100)
                y+=1
                break
    return cardnames   

def get_hof_pack(size):
    cardnames = []
    y = 0
    while(y<size):
        newurl = get_url(hofnames[randint(0, len(hofnames) - 1)])
        # print(newurl)
        uClient = uReq(newurl)
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

        try:
            product = SoupStrainer('div',{'class': 'col-sm-8'})
            snippet = soup(page_html, "lxml", parse_only=product)
            totalcards = int(snippet.findAll("p")[-2].text.split()[-1].replace(",", ""))
        except:
            continue
        
        lastpage = 1


        x = 0
        first = True
        tries = 20
        while (x < tries):
            cardtry = randint(1, totalcards)
            pagetry = math.ceil(cardtry/50.0)
            numberonpage = cardtry - (pagetry - 1)*50
            if (first):
                loc = moreurl.find("sTeam")
                moreurl = moreurl[:loc] + "PageIndex=" + str(pagetry) + "&" + moreurl[loc:]
                first = False
            elif(lastpage != pagetry):
                moreurl.replace("PageIndex=" + str(lastpage), "PageIndex=" + str(pagetry))
            lastpage = pagetry
            
            uClient = uReq(moreurl)
            page_html = uClient.read()
            uClient.close()
            
            page_soup = soup(page_html, "html.parser")
            cards = page_soup.findAll("tr")

            cardindex = numberonpage + 2

            try:
                imglink = "https://www.tcdb.com" + cards[cardindex].a["href"]
                uClient = uReq(imglink)
                page_html = uClient.read()
                uClient.close()
            except:
                x+=1
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
                x+=1
                continue

            

            if((frontimage == "/Images/DefaultFront.gif") or (backimage == "/Images/DefaultBack.gif")):
                x+=1

            else:
                urllib.request.urlretrieve("https://www.tcdb.com" + frontimage, "C:\\Users\\natha\\baseball-card-app\\src\\components\\CardBar\\hfrontimage" + str(y) + ".jpg")
                urllib.request.urlretrieve("https://www.tcdb.com" + backimage, "C:\\Users\\natha\\baseball-card-app\\src\\components\\CardBar\\hbackimage" + str(y) + ".jpg")
                cardnames.append(cards[cardindex].find("td", {"class": "vertical"}).a.text)
                
                imgfront = Image.open("C:\\Users\\natha\\baseball-card-app\\src\\components\\CardBar\\hfrontimage" + str(y) + ".jpg")
                imgback = Image.open("C:\\Users\\natha\\baseball-card-app\\src\\components\\CardBar\\hbackimage" + str(y) + ".jpg")
                
                if(imgback.width > imgback.height):
                    imgback.transpose(Image.ROTATE_90).save("C:\\Users\\natha\\baseball-card-app\\src\\components\\CardBar\\hbackimage" + str(y) + ".jpg", subsampling =0, quality=100)
                if(imgfront.width > imgfront.height):    
                    imgfront.transpose(Image.ROTATE_90).save("C:\\Users\\natha\\baseball-card-app\\src\\components\\CardBar\\hfrontimage" + str(y) + ".jpg", subsampling=0, quality=100)
                y+=1
                break
    return cardnames   

start = time.time()

writefile = open("C:\\Users\\natha\\baseball-card-app\\src\\components\\Cardbar\\namelist.json", "w")
# hofwritefile = open("C:\\Users\\natha\\baseball-card-app\\src\\components\\Cardbar\\hofnamelist.json", "w")

packs = get_pack(5)
# hofpack = get_hof_pack(1)

json.dump(packs, writefile, sort_keys=False, indent=4)
# json.dump(hofpack, hofwritefile, sort_keys=False, indent=4)

end = time.time()
print(end-start)