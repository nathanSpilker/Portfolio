import React, { useEffect, useState} from 'react';
import "./GamePage.css";
import Hand from "../Hand/Hand"
import OtherHand from "../OtherHand/OtherHand"
import BidButton from "../BidButton/BidButton"
import ScoreCard from "../ScoreCard/ScoreCard"
import WinnerCard from "../WinnerCard/WinnerCard"
import ChatBox from "../ChatBox/ChatBox"
import DisconnectedPage from '../DisconnectedPage/DisconnectedPage';
import tcanPic from "./tcan.jpg"
import AvatarIcon from '../AvatarIcon/AvatarIcon';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Draggable from 'react-draggable'
import CardBack from "./CardBack.jpg"
const WS_URL = "wss://tourneyrules.app/GameSocket"

const PIC = [1, 5, 33, 37, 41, 42, 43, 46]
const PID = [2, 6, 34, 38, 41, 42, 44, 45]
const PIH = [3, 7, 35, 39, 41, 42, 44, 45]
const PIS = [4, 8, 36, 40, 41, 42, 43, 46]

const CLUBS_INDS =  [1, 5,  9, 13, 17, 21, 25, 29, 33, 41, 42, 46, 43, 51, 47, 37]
const DMDS_INDS =   [2, 6, 10, 14, 18, 22, 26, 30, 34, 41, 42, 45, 44, 52, 48, 38]
const HEARTS_INDS = [3, 7, 11, 15, 19, 23, 27, 31, 35, 41, 42, 44, 45, 53, 49, 39]
const SPADES_INDS = [4, 8, 12, 16, 20, 24, 28, 32, 36, 41, 42, 43, 46, 54, 50, 40]


function GamePage(props) {

    const [myHand, setMyHand] = useState([]);
    const [myHandTrue, setMyHandTrue] = useState([]);
    const [dealerLocal, setDealerL] = useState("");
    const [cc2, setcc2] = useState(0);
    const [cc3, setcc3] = useState(0);
    const [cc4, setcc4] = useState(0);
    const [dealingAnimation, setDealingAnim] = useState(false);
    const [dealingAnimationFill, setDealingAnimFill] = useState(false);
    const [handMount, setHandMount] = useState(true)
    const [playedCard1, setPc1] = useState("")
    const [playedCard2, setPc2] = useState("")
    const [playedCard3, setPc3] = useState("")
    const [playedCard4, setPc4] = useState("")
    const [currentDealer, setCD] = useState("")
    const [waitForDealer, setWFD] = useState(false)
    const [currentBidder, setCB] = useState("")
    const [bidHolder, setBH] = useState("")
    const [bid, setB] = useState("0")
    const [bidCycle, setBC] = useState(false)
    const [suitCycle, setSC] = useState(false)
    const [bidWinner, setBW] = useState("")
    const [suit, setSuit] = useState("")
    const [discCycle, setDC] = useState(false)
    const [confirmedWaiting, setCW] = useState(false)
    const [fillCycle, setFC] = useState(false)
    const [fill1, setf1] = useState(0)
    const [fill2, setf2] = useState(0)
    const [fill3, setf3] = useState(0)
    const [fill4, setf4] = useState(0)   
    const [RRD, setRenderRemainingDeck] = useState(false)
    const [flippedCardAvailable, setFCA] = useState(false)
    const [flippedCard, setFlippedCard] = useState("")
    const [passedTo, setDeckPassedTo] = useState("")  
    const [passed, setPassed] = useState(false)         
    const [cardsRemInDeck, setCardsRemInDeck] = useState(0)   
    const [playCycleFlag, setPCF] = useState(false)   
    const [waitingOn2Play, setW2P] = useState("")
    // const [OOC1, setOOC1] = useState(false)  
    // const [OOC2, setOOC2] = useState(false)  
    // const [OOC3, setOOC3] = useState(false)  
    // const [OOC4, setOOC4] = useState(false)
    const [t1PtsThisRound, setT1PTR] = useState(0)
    const [t2PtsThisRound, setT2PTR] = useState(0)  
    const [t1Pts, setT1P] = useState(0)
    const [t2Pts, setT2P] = useState(0)
    const [trickWinner, setTrickWinner] = useState("")
    const [trickWinnerCycle, setTWC] = useState(false)  
    const [gameOverFlag, setGOF] = useState(false)
    const [winningTeam, setWinningTeam] = useState(-1)
    // const [connected, setConnected] = useState(false)
    const [disconnectedFlag, setDisconnectedFlag] = useState(false)
    const [userDisconnected, setUserDisconnected] = useState("")

    var renderFor450 = window.screen.width <= 450;

    var avatarWidth;

    if (renderFor450)
    {
        avatarWidth = '40px';
    }
    else
    {
        avatarWidth = '70px'
    }

    let localUser1;
    let localUser2;
    let localUser3;
    let localUser4;
    let localL1;
    let localL2;
    let localL3;
    let localL4;
    
    if (props.myspot === "1")
    {
        localUser1 = props.user1;
        localUser2 = props.user2;
        localUser3 = props.user3;
        localUser4 = props.user4;
        localL1 = props.lcode1;
        localL2 = props.lcode2;
        localL3 = props.lcode3;
        localL4 = props.lcode4;
    }

    if (props.myspot === "2")
    {
        localUser1 = props.user2;
        localUser2 = props.user3;
        localUser3 = props.user4;
        localUser4 = props.user1;
        localL1 = props.lcode2;
        localL2 = props.lcode3;
        localL3 = props.lcode4;
        localL4 = props.lcode1;
    }

    if (props.myspot === "3")
    {
        localUser1 = props.user3;
        localUser2 = props.user4;
        localUser3 = props.user1;
        localUser4 = props.user2;
        localL1 = props.lcode3;
        localL2 = props.lcode4;
        localL3 = props.lcode1;
        localL4 = props.lcode2;
    }

    if (props.myspot === "4")
    {
        localUser1 = props.user4;
        localUser2 = props.user1;
        localUser3 = props.user2;
        localUser4 = props.user3;
        localL1 = props.lcode4;
        localL2 = props.lcode1;
        localL3 = props.lcode2;
        localL4 = props.lcode3;
    }

    const { sendJsonMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
        onOpen: () => {
          console.log("GameSocket connection established.");
        },
        // share: true,
        // filter: () => false,
        retryOnError: true,
        shouldReconnect: () => true,
      });

      useEffect(() => {
        console.log("Connection state changed to GameSocket")
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
            event: "RegisterForGame",
            gameCode: props.gameCode,
            uid: JSON.parse(localStorage.getItem("uid")),
            userName: props.username
            })
        }
      }, [readyState])
      
      useEffect(() => {
        if (JSON.parse(localStorage.getItem("uid")) != null)
        {
            loadFromStorage()
        }
        // else
        // {
        //     setStorage()
        // }
      }, [])

      useEffect(() => {
        if (lastMessage !== null)
        {
            var data = lastMessage.data;
            data = data.replace(/'/g, '"');
            data = JSON.parse(data);
            // console.log(data)
            if (data["event"] === "dealerPush")
            {
                localStorage.setItem("currentDealer", JSON.stringify(data["currentDealer"]))
                setCD(data["currentDealer"])
                localStorage.setItem("dealerLocal", JSON.stringify(props.spotmap.indexOf(parseInt(data["currentDealer"], 10))))
                setDealerL(props.spotmap.indexOf(parseInt(data["currentDealer"], 10)))
                localStorage.setItem("waitForDealer", JSON.stringify(true))
                setWFD(true)
            }
            else if (data["event"] === "handPush")
            {
                localStorage.setItem("myHandTrue", JSON.stringify(data["myHand"]))
                setMyHandTrue(data["myHand"])
                dealAnimation()
            }

            else if (data["event"] === "UserDisconnect")
            {
                localStorage.setItem("userDisconnected", JSON.stringify(data["user"]))
                setUserDisconnected(data["user"])
                localStorage.setItem("disconnectedFlag", JSON.stringify(true))
                setDisconnectedFlag(true)
            }

            else if (data["event"] === "UserReconnect")
            {
                localStorage.setItem("userDisconnected", JSON.stringify(""))
                setUserDisconnected("")
                localStorage.setItem("disconnectedFlag", JSON.stringify(false))
                setDisconnectedFlag(false)
            }

            else if (data["event"] === "noGameForUid")
            {
                props.setHomeStorage()
                props.loadHomeFromStorage()
            }

            else if (data["event"] === "bidPush")
            {
                localStorage.setItem("waitForDealer", JSON.stringify(false))
                setWFD(false)
                localStorage.setItem("bidCycle", JSON.stringify(true))
                setBC(true)
                localStorage.setItem("currentBidder", JSON.stringify(data["currentBidder"]))
                setCB(data["currentBidder"])
                localStorage.setItem("bidHolder", JSON.stringify(data["bidHolder"]))
                setBH(data["bidHolder"])
                localStorage.setItem("bid", JSON.stringify(data["currentBid"]))
                setB(data["currentBid"])
            }

            else if (data["event"] === "bidWinner")
            {
                localStorage.setItem("bidCycle", JSON.stringify(false))
                setBC(false)
                localStorage.setItem("suitCycle", JSON.stringify(true))
                setSC(true)
                localStorage.setItem("bidWinner", JSON.stringify(data["bidWinner"]))
                setBW(data["bidWinner"])
                localStorage.setItem("bid", JSON.stringify(data["bid"]))
                setB(data["bid"])
            }

            else if (data["event"] === "suitPush")
            {
                localStorage.setItem("suitCycle", JSON.stringify(false))
                setSC(false)
                localStorage.setItem("discCycle", JSON.stringify(true))
                setDC(true)
                localStorage.setItem("suit", JSON.stringify(data["suit"]))
                setSuit(data["suit"])
            }

            else if (data["event"] === "numCardsPush")
            {
                var ccl1 = data["cardsRem1"]
                var ccl2 = data["cardsRem2"]
                var ccl3 = data["cardsRem3"]
                var ccl4 = data["cardsRem4"]

                if (props.myspot === "1")
                {
                    localStorage.setItem("cc2", JSON.stringify(ccl2))
                    setcc2(ccl2)
                    localStorage.setItem("cc3", JSON.stringify(ccl3))
                    setcc3(ccl3)
                    localStorage.setItem("cc4", JSON.stringify(ccl4))
                    setcc4(ccl4)
                }
                if (props.myspot === "2")
                {
                    localStorage.setItem("cc2", JSON.stringify(ccl3))
                    setcc2(ccl3)
                    localStorage.setItem("cc3", JSON.stringify(ccl4))
                    setcc3(ccl4)
                    localStorage.setItem("cc4", JSON.stringify(ccl1))
                    setcc4(ccl1)
                }
                if (props.myspot === "3")
                {
                    localStorage.setItem("cc2", JSON.stringify(ccl4))
                    setcc2(ccl4)
                    localStorage.setItem("cc3", JSON.stringify(ccl1))
                    setcc3(ccl1)
                    localStorage.setItem("cc4", JSON.stringify(ccl2))
                    setcc4(ccl2)
                }
                if (props.myspot === "4")
                {
                    localStorage.setItem("cc2", JSON.stringify(ccl1))
                    setcc2(ccl1)
                    localStorage.setItem("cc3", JSON.stringify(ccl2))
                    setcc3(ccl2)
                    localStorage.setItem("cc4", JSON.stringify(ccl3))
                    setcc4(ccl3)
                }
            }

            else if (data["event"] === "handFillPush")
            {
                localStorage.setItem("dealingAnimationFill", JSON.stringify(true))
                setDealingAnimFill(true)
                var myHandIn = data["myHand"]
                localStorage.setItem("myHandTrue", JSON.stringify(myHandIn))
                setMyHandTrue(myHandIn)
                localStorage.setItem("fill1", JSON.stringify(data["cardsAdded1"]))
                setf1(data["cardsAdded1"])
                localStorage.setItem("fill2", JSON.stringify(data["cardsAdded2"]))
                setf2(data["cardsAdded2"])
                localStorage.setItem("fill3", JSON.stringify(data["cardsAdded3"]))
                setf3(data["cardsAdded3"])
                localStorage.setItem("fill4", JSON.stringify(data["cardsAdded4"]))
                setf4(data["cardsAdded4"])
                localStorage.setItem("discCycle", JSON.stringify(false))
                setDC(false)
                localStorage.setItem("confirmedWaiting", JSON.stringify(false))
                setCW(false)
                localStorage.setItem("fillCycle", JSON.stringify(true))
                setFC(true)
                localStorage.setItem("cardsRemInDeck", JSON.stringify(data["cardsRemInDeck"]))
                setCardsRemInDeck(data["cardsRemInDeck"])

                
                var firstDealt = (dealerLocal % 4) + 1
                if (firstDealt === 1)
                {
                    if (myHand.length < 6)
                    {
                        localStorage.setItem("myHand", JSON.stringify(myHand.concat(myHandIn[myHand.length])))
                        setMyHand(myHand.concat(myHandIn[myHand.length]))
                    }
                    else if (cc2 < 6)
                    {
                        localStorage.setItem("cc2", JSON.stringify(cc2 + 1))
                        setcc2(cc2 + 1)
                    }
                    else if (cc3 < 6)
                    {
                        localStorage.setItem("cc3", JSON.stringify(cc3 + 1))
                        setcc3(cc3 + 1)
                    }
                    else if (cc4 < 6)
                    {
                        localStorage.setItem("cc4", JSON.stringify(cc4 + 1))
                        setcc4(cc4 + 1)
                    }
                }
                else if (firstDealt === 2)
                {
                    if (cc2 < 6)
                    {
                        localStorage.setItem("cc2", JSON.stringify(cc2 + 1))
                        setcc2(cc2 + 1)
                    }
                    else if (cc3 < 6)
                    {
                        localStorage.setItem("cc3", JSON.stringify(cc3 + 1))
                        setcc3(cc3 + 1)
                    }
                    else if (cc4 < 6)
                    {
                        localStorage.setItem("cc4", JSON.stringify(cc4 + 1))
                        setcc4(cc4 + 1)
                    }
                    else if (myHand.length < 6)
                    {
                        localStorage.setItem("myHand", JSON.stringify(myHand.concat(myHandIn[myHand.length])))
                        setMyHand(myHand.concat(myHandIn[myHand.length]))
                    }
                }
                else if (firstDealt === 3)
                {
                    if (cc3 < 6)
                    {
                        localStorage.setItem("cc3", JSON.stringify(cc3 + 1))
                        setcc3(cc3 + 1)
                    }
                    else if (cc4 < 6)
                    {
                        localStorage.setItem("cc4", JSON.stringify(cc4 + 1))
                        setcc4(cc4 + 1)
                    }
                    else if (myHand.length < 6)
                    {
                        localStorage.setItem("myHand", JSON.stringify(myHand.concat(myHandIn[myHand.length])))
                        setMyHand(myHand.concat(myHandIn[myHand.length]))
                    }
                    else if (cc2 < 6)
                    {
                        localStorage.setItem("cc2", JSON.stringify(cc2 + 1))
                        setcc2(cc2 + 1)
                    }
                }
                else 
                {
                    if (cc4 < 6)
                    {
                        localStorage.setItem("cc4", JSON.stringify(cc4 + 1))
                        setcc4(cc4 + 1)
                    }
                    else if (myHand.length < 6)
                    {
                        localStorage.setItem("myHand", JSON.stringify(myHand.concat(myHandIn[myHand.length])))
                        setMyHand(myHand.concat(myHandIn[myHand.length]))
                    }
                    else if (cc2 < 6)
                    {
                        localStorage.setItem("cc2", JSON.stringify(cc2 + 1))
                        setcc2(cc2 + 1)
                    }
                    else if (cc3 < 6)
                    {
                        localStorage.setItem("cc3", JSON.stringify(cc3 + 1))
                        setcc3(cc3 + 1)
                    }
                }
            }

            else if (data["event"] === "passPush")
            {
                localStorage.setItem("passedTo", JSON.stringify(data["passTo"]))
                setDeckPassedTo(data["passTo"])
                localStorage.setItem("passed", JSON.stringify(true))
                setPassed(true)
            }

            else if (data["event"] === "flipCardPush")
            {

                var cardsRemaining = data["cardsRemain"]
                localStorage.setItem("cardsRemInDeck", JSON.stringify(cardsRemaining))
                setCardsRemInDeck(cardsRemaining)

                localStorage.setItem("flippedCardAvailable", JSON.stringify(true))
                setFCA(true)
                localStorage.setItem("flippedCard", JSON.stringify(data["flippedCard"]))
                setFlippedCard(data["flippedCard"])

            }

            else if (data["event"] === "playStartPush")
            {

                localStorage.setItem("waitingOn2Play", JSON.stringify(data["lead"]))
                setW2P(data["lead"])
                localStorage.setItem("RRD", JSON.stringify(false))
                setRenderRemainingDeck(false)
                localStorage.setItem("playCycleFlag", JSON.stringify(true))
                setPCF(true)
                localStorage.setItem("fillCycle", JSON.stringify(false))
                setFC(false)
                localStorage.setItem("t1PtsThisRound", JSON.stringify(0))
                setT1PTR(0)
                localStorage.setItem("t2PtsThisRound", JSON.stringify(0))
                setT2PTR(0)
            }

            else if (data["event"] === "playedCardPush")
            {

                var pc1 = data["playedCard1"]
                var pc2 = data["playedCard2"]
                var pc3 = data["playedCard3"]
                var pc4 = data["playedCard4"]

                if (waitingOn2Play == 1)
                {
                    if (props.myspot === "2")
                    {
                        localStorage.setItem("cc4", JSON.stringify(cc4 - 1))
                        setcc4(cc4 - 1)
                    }
                    if (props.myspot === "3")
                    {
                        localStorage.setItem("cc3", JSON.stringify(cc3 - 1))
                        setcc3(cc3 - 1)
                    }
                    if (props.myspot === "4")
                    {
                        localStorage.setItem("cc2", JSON.stringify(cc2 - 1))
                        setcc2(cc2 - 1)
                    }
                }
                if (waitingOn2Play == 2)
                {
                    if (props.myspot === "1")
                    {
                        localStorage.setItem("cc2", JSON.stringify(cc2 - 1))
                        setcc2(cc2 - 1)
                    }
                    if (props.myspot === "3")
                    {
                        localStorage.setItem("cc4", JSON.stringify(cc4 - 1))
                        setcc4(cc4 - 1)
                    }
                    if (props.myspot === "4")
                    {
                        localStorage.setItem("cc3", JSON.stringify(cc3 - 1))
                        setcc3(cc3 - 1)
                    }
                }
                if (waitingOn2Play == 3)
                {
                    if (props.myspot === "1")
                    {
                        localStorage.setItem("cc3", JSON.stringify(cc3 - 1))
                        setcc3(cc3 - 1)
                    }
                    if (props.myspot === "2")
                    {
                        localStorage.setItem("cc2", JSON.stringify(cc2 - 1))
                        setcc2(cc2 - 1)
                    }
                    if (props.myspot === "4")
                    {
                        localStorage.setItem("cc4", JSON.stringify(cc4 - 1))
                        setcc4(cc4 - 1)
                    }
                }
                if (waitingOn2Play == 4)
                {
                    if (props.myspot === "1")
                    {
                        localStorage.setItem("cc4", JSON.stringify(cc4 - 1))
                        setcc4(cc4 - 1)
                    }
                    if (props.myspot === "2")
                    {
                        localStorage.setItem("cc3", JSON.stringify(cc3 - 1))
                        setcc3(cc3 - 1)
                    }
                    if (props.myspot === "3")
                    {
                        localStorage.setItem("cc2", JSON.stringify(cc2 - 1))
                        setcc2(cc2 - 1)
                    }
                }

                if (pc1 === -1)
                {
                    pc1 = ""
                }
                if (pc2 === -1)
                {
                    pc2 = ""
                }
                if (pc3 === -1)
                {
                    pc3 = ""
                }
                if (pc4 === -1)
                {
                    pc4 = ""
                }

                if (data["Out1"])
                {
                    if (props.myspot === "1")
                    {
                        localStorage.setItem("myHand", JSON.stringify([]))
                        setMyHand([])
                    }
                    if (props.myspot === "2")
                    {
                        localStorage.setItem("cc4", JSON.stringify(0))
                        setcc4(0)
                    }
                    if (props.myspot === "3")
                    {
                        localStorage.setItem("cc3", JSON.stringify(0))
                        setcc3(0)
                    }
                    if (props.myspot === "4")
                    {
                        localStorage.setItem("cc2", JSON.stringify(0))
                        setcc2(0)
                    }

                }

                if (data["Out2"])
                {
                    if (props.myspot === "1")
                    {     
                        localStorage.setItem("cc2", JSON.stringify(0))
                        setcc2(0)
                    }
                    if (props.myspot === "2")
                    {
                        localStorage.setItem("myHand", JSON.stringify([]))
                        setMyHand([])
                    }
                    if (props.myspot === "3")
                    {
                        localStorage.setItem("cc4", JSON.stringify(0))
                        setcc4(0)
                    }
                    if (props.myspot === "4")
                    {
                        localStorage.setItem("cc3", JSON.stringify(0))
                        setcc3(0)
                    }
                }

                if (data["Out3"])
                {
                    if (props.myspot === "1")
                    {     
                        localStorage.setItem("cc3", JSON.stringify(0))
                        setcc3(0)
                    }
                    if (props.myspot === "2")
                    {
                        localStorage.setItem("cc2", JSON.stringify(0))
                        setcc2(0)
                    }
                    if (props.myspot === "3")
                    {
                        localStorage.setItem("myHand", JSON.stringify([]))
                        setMyHand([])
                    }
                    if (props.myspot === "4")
                    {
                        localStorage.setItem("cc4", JSON.stringify(0))
                        setcc4(0)
                    }
                }

                if (data["Out4"])
                {
                    if (props.myspot === "1")
                    {   
                        localStorage.setItem("cc4", JSON.stringify(0))  
                        setcc4(0)
                    }
                    if (props.myspot === "2")
                    {
                        localStorage.setItem("cc3", JSON.stringify(0))
                        setcc3(0)
                    }
                    if (props.myspot === "3")
                    {
                        localStorage.setItem("cc2", JSON.stringify(0))
                        setcc2(0)
                    }
                    if (props.myspot === "4")
                    {
                        localStorage.setItem("myHand", JSON.stringify([]))
                        setMyHand([])
                    }
                }


                if (props.myspot === "1")
                {
                    localStorage.setItem("playedCard1", JSON.stringify(pc1))
                    setPc1(pc1)
                    localStorage.setItem("playedCard2", JSON.stringify(pc2))
                    setPc2(pc2)
                    localStorage.setItem("playedCard3", JSON.stringify(pc3))
                    setPc3(pc3)
                    localStorage.setItem("playedCard4", JSON.stringify(pc4))
                    setPc4(pc4)

                }

                if (props.myspot === "2")
                {
                    localStorage.setItem("playedCard1", JSON.stringify(pc2))
                    setPc1(pc2)
                    localStorage.setItem("playedCard2", JSON.stringify(pc3))
                    setPc2(pc3)
                    localStorage.setItem("playedCard3", JSON.stringify(pc4))
                    setPc3(pc4)
                    localStorage.setItem("playedCard4", JSON.stringify(pc1))
                    setPc4(pc1)
                }

                if (props.myspot === "3")
                {
                    localStorage.setItem("playedCard1", JSON.stringify(pc3))
                    setPc1(pc3)
                    localStorage.setItem("playedCard2", JSON.stringify(pc4))
                    setPc2(pc4)
                    localStorage.setItem("playedCard3", JSON.stringify(pc1))
                    setPc3(pc1)
                    localStorage.setItem("playedCard4", JSON.stringify(pc2))
                    setPc4(pc2)
                }

                if (props.myspot === "4")
                {
                    localStorage.setItem("playedCard1", JSON.stringify(pc4))
                    setPc1(pc4)
                    localStorage.setItem("playedCard2", JSON.stringify(pc1))
                    setPc2(pc1)
                    localStorage.setItem("playedCard3", JSON.stringify(pc2))
                    setPc3(pc2)
                    localStorage.setItem("playedCard4", JSON.stringify(pc3))
                    setPc4(pc3)
                }


                if (data["doneWithTrick"])
                {
                    localStorage.setItem("trickWinner", JSON.stringify(data["trickWinner"]))
                    setTrickWinner(data["trickWinner"])
                    localStorage.setItem("trickWinnerCycle", JSON.stringify(true))
                    setTWC(true)   
                }
                else
                {
                    localStorage.setItem("waitingOn2Play", JSON.stringify(data["lead"]))
                    setW2P(data["lead"])
                }

            }
            else if (data["event"] === "HandResetPush")
            {
                var pc1 = data["playedCard1"]
                var pc2 = data["playedCard2"]
                var pc3 = data["playedCard3"]
                var pc4 = data["playedCard4"]
                
                if (pc1 === -1)
                    {
                        pc1 = ""
                    }
                    if (pc2 === -1)
                    {
                        pc2 = ""
                    }
                    if (pc3 === -1)
                    {
                        pc3 = ""
                    }
                    if (pc4 === -1)
                    {
                        pc4 = ""
                    }
    
                if (data["Out1"])
                {
                    if (props.myspot === "1")
                    {
                        localStorage.setItem("myHand", JSON.stringify([]))
                        setMyHand([])
                    }
                    if (props.myspot === "2")
                    {
                        localStorage.setItem("cc4", JSON.stringify(0))
                        setcc4(0)
                    }
                    if (props.myspot === "3")
                    {
                        localStorage.setItem("cc3", JSON.stringify(0))
                        setcc3(0)
                    }
                    if (props.myspot === "4")
                    {
                        localStorage.setItem("cc2", JSON.stringify(0))
                        setcc2(0)
                    }

                }
    
                if (data["Out2"])
                {
                    if (props.myspot === "1")
                    { 
                        localStorage.setItem("cc2", JSON.stringify(0))    
                        setcc2(0)
                    }
                    if (props.myspot === "2")
                    {
                        localStorage.setItem("myHand", JSON.stringify([]))
                        setMyHand([])
                    }
                    if (props.myspot === "3")
                    {
                        localStorage.setItem("cc4", JSON.stringify(0))
                        setcc4(0)
                    }
                    if (props.myspot === "4")
                    {
                        localStorage.setItem("cc3", JSON.stringify(0))
                        setcc3(0)
                    }
                }
    
                if (data["Out3"])
                {
                    if (props.myspot === "1")
                    {     
                        localStorage.setItem("cc3", JSON.stringify(0))
                        setcc3(0)
                    }
                    if (props.myspot === "2")
                    {
                        localStorage.setItem("cc2", JSON.stringify(0))
                        setcc2(0)
                    }
                    if (props.myspot === "3")
                    {
                        localStorage.setItem("myHand", JSON.stringify([]))
                        setMyHand([])
                    }
                    if (props.myspot === "4")
                    {
                        localStorage.setItem("cc4", JSON.stringify(0))
                        setcc4(0)
                    }
                }
    
                if (data["Out4"])
                {
                    if (props.myspot === "1")
                    {     
                        localStorage.setItem("cc4", JSON.stringify(0))
                        setcc4(0)
                    }
                    if (props.myspot === "2")
                    {
                        localStorage.setItem("cc3", JSON.stringify(0))
                        setcc3(0)
                    }
                    if (props.myspot === "3")
                    {
                        localStorage.setItem("cc2", JSON.stringify(0))
                        setcc2(0)
                    }
                    if (props.myspot === "4")
                    {
                        localStorage.setItem("myHand", JSON.stringify([]))
                        setMyHand([])
                    }
                }

                if (props.myspot === "1")
                {
                    localStorage.setItem("playedCard1", JSON.stringify(pc1))
                    setPc1(pc1)
                    localStorage.setItem("playedCard2", JSON.stringify(pc2))
                    setPc2(pc2)
                    localStorage.setItem("playedCard3", JSON.stringify(pc3))
                    setPc3(pc3)
                    localStorage.setItem("playedCard4", JSON.stringify(pc4))
                    setPc4(pc4)

                }

                if (props.myspot === "2")
                {
                    localStorage.setItem("playedCard1", JSON.stringify(pc2))
                    setPc1(pc2)
                    localStorage.setItem("playedCard2", JSON.stringify(pc3))
                    setPc2(pc3)
                    localStorage.setItem("playedCard3", JSON.stringify(pc4))
                    setPc3(pc4)
                    localStorage.setItem("playedCard4", JSON.stringify(pc1))
                    setPc4(pc1)
                }

                if (props.myspot === "3")
                {
                    localStorage.setItem("playedCard1", JSON.stringify(pc3))
                    setPc1(pc3)
                    localStorage.setItem("playedCard2", JSON.stringify(pc4))
                    setPc2(pc4)
                    localStorage.setItem("playedCard3", JSON.stringify(pc1))
                    setPc3(pc1)
                    localStorage.setItem("playedCard4", JSON.stringify(pc2))
                    setPc4(pc2)
                }

                if (props.myspot === "4")
                {
                    localStorage.setItem("playedCard1", JSON.stringify(pc4))
                    setPc1(pc4)
                    localStorage.setItem("playedCard2", JSON.stringify(pc1))
                    setPc2(pc1)
                    localStorage.setItem("playedCard3", JSON.stringify(pc2))
                    setPc3(pc2)
                    localStorage.setItem("playedCard4", JSON.stringify(pc3))
                    setPc4(pc3)
                }

                localStorage.setItem("t1PtsThisRound", JSON.stringify(data["team1Pts"]))
                setT1PTR(data["team1Pts"])
                localStorage.setItem("t2PtsThisRound", JSON.stringify(data["team2Pts"]))
                setT2PTR(data["team2Pts"])
                localStorage.setItem("waitingOn2Play", JSON.stringify(data["lead"]))
                setW2P(data["lead"])

                localStorage.setItem("trickWinnerCycle", JSON.stringify(false))
                setTWC(false)
                localStorage.setItem("trickWinner", JSON.stringify(""))
                setTrickWinner("")
            }
            else if (data["event"] === "RoundOverPush")
            {
                localStorage.setItem("t1PtsThisRound", JSON.stringify(0))
                setT1PTR(0)
                localStorage.setItem("t2PtsThisRound", JSON.stringify(0))
                setT2PTR(0)
                localStorage.setItem("t1Pts", JSON.stringify(data["team1Score"]))
                setT1P(data["team1Score"])
                localStorage.setItem("t2Pts", JSON.stringify(data["team2Score"]))
                setT2P(data["team2Score"])

                localStorage.setItem("currentDealer", JSON.stringify(data["currentDealer"]))
                setCD(data["currentDealer"])
                localStorage.setItem("dealerLocal", JSON.stringify(props.spotmap.indexOf(parseInt(data["currentDealer"], 10))))
                setDealerL(props.spotmap.indexOf(parseInt(data["currentDealer"], 10)))
                localStorage.setItem("waitForDealer", JSON.stringify(true))
                setWFD(true)

                localStorage.setItem("myHand", JSON.stringify([]))
                setMyHand([])
                localStorage.setItem("myHandTrue", JSON.stringify([]))
                setMyHandTrue([])
                localStorage.setItem("cc2", JSON.stringify(0))
                setcc2(0)
                localStorage.setItem("cc3", JSON.stringify(0))
                setcc3(0)
                localStorage.setItem("cc4", JSON.stringify(0))
                setcc4(0)

                localStorage.setItem("bid", JSON.stringify("0"))
                setB("0")
                localStorage.setItem("currentBidder", JSON.stringify(""))
                setCB("")
                localStorage.setItem("bidHolder", JSON.stringify(""))
                setBH("")
                localStorage.setItem("bidWinner", JSON.stringify(""))
                setBW("")

                localStorage.setItem("fill1", JSON.stringify(0))
                setf1(0)
                localStorage.setItem("fill2", JSON.stringify(0))
                setf2(0)
                localStorage.setItem("fill3", JSON.stringify(0))
                setf3(0)
                localStorage.setItem("fill4", JSON.stringify(0))
                setf4(0)

                localStorage.setItem("passedTo", JSON.stringify(""))
                setDeckPassedTo("")
                localStorage.setItem("passed", JSON.stringify(false))
                setPassed(false)

                localStorage.setItem("waitingOn2Play", JSON.stringify(""))
                setW2P("")
                localStorage.setItem("playedCard1", JSON.stringify(""))
                setPc1("")
                localStorage.setItem("playedCard2", JSON.stringify(""))
                setPc2("")
                localStorage.setItem("playedCard3", JSON.stringify(""))
                setPc3("")
                localStorage.setItem("playedCard4", JSON.stringify(""))
                setPc4("")
                localStorage.setItem("trickWinnerCycle", JSON.stringify(false))
                setTWC(false)
                localStorage.setItem("playCycleFlag", JSON.stringify(false))
                setPCF(false)
                localStorage.setItem("trickWinner", JSON.stringify(""))
                setTrickWinner("")
            }

            else if (data["event"] === "GameOverPush")
            {
                localStorage.setItem("t1PtsThisRound", JSON.stringify(0))
                setT1PTR(0)
                localStorage.setItem("t2PtsThisRound", JSON.stringify(0))
                setT2PTR(0)
                localStorage.setItem("t1Pts", JSON.stringify(data["team1Score"]))
                setT1P(data["team1Score"])
                localStorage.setItem("t2Pts", JSON.stringify(data["team2Score"]))
                setT2P(data["team2Score"])

                localStorage.setItem("myHand", JSON.stringify([]))
                setMyHand([])
                localStorage.setItem("myHandTrue", JSON.stringify([]))
                setMyHandTrue([])
                localStorage.setItem("cc2", JSON.stringify(0))
                setcc2(0)
                localStorage.setItem("cc3", JSON.stringify(0))
                setcc3(0)
                localStorage.setItem("cc4", JSON.stringify(0))
                setcc4(0)

                localStorage.setItem("bid", JSON.stringify("0"))
                setB("0")
                localStorage.setItem("currentBidder", JSON.stringify(""))
                setCB("")
                localStorage.setItem("bidHolder", JSON.stringify(""))
                setBH("")
                localStorage.setItem("bidWinner", JSON.stringify(""))
                setBW("")

                localStorage.setItem("fill1", JSON.stringify(0))
                setf1(0)
                localStorage.setItem("fill2", JSON.stringify(0))
                setf2(0)
                localStorage.setItem("fill3", JSON.stringify(0))
                setf3(0)
                localStorage.setItem("fill4", JSON.stringify(0))
                setf4(0)

                localStorage.setItem("passedTo", JSON.stringify(""))
                setDeckPassedTo("")
                localStorage.setItem("passed", JSON.stringify(false))
                setPassed(false)

                localStorage.setItem("waitingOn2Play", JSON.stringify(""))
                setW2P("")
                localStorage.setItem("playedCard1", JSON.stringify(""))
                setPc1("")
                localStorage.setItem("playedCard2", JSON.stringify(""))
                setPc2("")
                localStorage.setItem("playedCard3", JSON.stringify(""))
                setPc3("")
                localStorage.setItem("playedCard4", JSON.stringify(""))
                setPc4("")
                localStorage.setItem("trickWinnerCycle", JSON.stringify(false))
                setTWC(false)
                localStorage.setItem("playCycleFlag", JSON.stringify(false))
                setPCF(false)
                localStorage.setItem("trickWinner", JSON.stringify(""))
                setTrickWinner("")

                localStorage.setItem("winningTeam", JSON.stringify(data["winningTeam"]))
                setWinningTeam(data["winningTeam"])
                localStorage.setItem("gameOverFlag", JSON.stringify(true))
                setGOF(true)
            }
            else if (data["event"] === "restartGamePush")
            {
                localStorage.setItem("gameOverFlag", JSON.stringify(false))
                setGOF(false)
                localStorage.setItem("winningTeam", JSON.stringify(-1))
                setWinningTeam(-1)
                localStorage.setItem("t1Pts", JSON.stringify(0))
                setT1P(0)
                localStorage.setItem("t2Pts", JSON.stringify(0))
                setT2P(0)
                localStorage.setItem("currentDealer", JSON.stringify(data["currentDealer"]))
                setCD(data["currentDealer"])
                localStorage.setItem("dealerLocal", JSON.stringify(props.spotmap.indexOf(parseInt(data["currentDealer"], 10))))
                setDealerL(props.spotmap.indexOf(parseInt(data["currentDealer"], 10)))
                localStorage.setItem("waitForDealer", JSON.stringify(true))
                setWFD(true)
            }
        }
      }, [lastMessage])

    useEffect (() => {
        if (dealingAnimation || dealingAnimationFill)
        {
            if (cc4 < 9 && dealingAnimation)
            {
                localStorage.setItem("cc4", JSON.stringify(cc4 + 1))
                setTimeout(() => {setcc4(cc4 + 1)}, 100)
            }

            if (cc3 < 6 && dealingAnimationFill)
            {
                localStorage.setItem("cc3", JSON.stringify(cc3 + 1))
                setTimeout(() => {setcc3(cc3 + 1)}, 300)
            }

            if (cc3 === 6 && cc4 < 6 && dealingAnimationFill)
            {
                localStorage.setItem("cc4", JSON.stringify(cc4 + 1))
                setTimeout(() => {setcc4(cc4 + 1)}, 300)
            }

            if (cc3 === 6 && cc4 === 6 && myHand.length < 6 && dealingAnimationFill)
            {
                localStorage.setItem("myHand", JSON.stringify(myHand.concat(myHandTrue[myHand.length])))
                setTimeout(() => {setMyHand(myHand.concat(myHandTrue[myHand.length]))}, 300)
            }

            if (cc3 === 6 && cc4 === 6 && myHand.length === 6 && cc2 < 6 && dealingAnimationFill)
            {
                localStorage.setItem("cc2", JSON.stringify(cc2 + 1))
                setTimeout(() => {setcc2(cc2 + 1)}, 300)
            }
        }
    }, [cc3]);

    useEffect (() => {

        if (dealingAnimation || dealingAnimationFill)
        {
            if (myHand.length < 8 && dealingAnimation)
            {
                localStorage.setItem("myHand", JSON.stringify(myHand.concat("card")))
                setTimeout(() => {setMyHand(myHand.concat("card"))}, 100)
            }
            if (myHand.length === 8 && dealingAnimation)
            {
                localStorage.setItem("myHand", JSON.stringify(myHandTrue))
                setMyHand(myHandTrue)
            }

            if (cc4 < 6 && dealingAnimationFill)
            {
                localStorage.setItem("cc4", JSON.stringify(cc4 + 1))
                setTimeout(() => {setcc4(cc4 + 1)}, 300)
            }

            if (cc4 === 6 && myHand.length < 6 && dealingAnimationFill)
            {
                localStorage.setItem("myHand", JSON.stringify(myHand.concat(myHandTrue[myHand.length])))
                setTimeout(() => {setMyHand(myHand.concat(myHandTrue[myHand.length]))}, 300)
            }

            if (cc4 === 6 && myHand.length === 6 && cc2 < 6 && dealingAnimationFill)
            {
                localStorage.setItem("cc2", JSON.stringify(cc2 + 1))
                setTimeout(() => {setcc2(cc2 + 1)}, 300)
            }

            if (cc4 === 6 && myHand.length === 6 && cc2 === 6 && cc3 < 6 && dealingAnimationFill)
            {
                localStorage.setItem("cc3", JSON.stringify(cc3 + 1))
                setTimeout(() => {setcc3(cc3 + 1)}, 300)
            }
        }
    }, [cc4]);

    useEffect (() => {
        
        if (dealingAnimation || dealingAnimationFill)
        {
            if (cc2 < 9 && dealingAnimation)
            {
                localStorage.setItem("cc2", JSON.stringify(cc2 + 1))
                setTimeout(() => {setcc2(cc2 + 1)}, 100)
            }

            if (cc2 < 6 && dealingAnimationFill)
            {
                localStorage.setItem("cc2", JSON.stringify(cc2 + 1))
                setTimeout(() => {setcc2(cc2 + 1)}, 300)
            }

            if (cc2 === 6 && cc3 < 6 && dealingAnimationFill)
            {
                localStorage.setItem("cc3", JSON.stringify(cc3 + 1))
                setTimeout(() => {setcc3(cc3 + 1)}, 300)
            }

            if (cc2 === 6 && cc3 === 6 && cc4 < 6 && dealingAnimationFill)
            {
                localStorage.setItem("cc4", JSON.stringify(cc4 + 1))
                setTimeout(() => {setcc4(cc4 + 1)}, 300)
            }

            if (cc2 === 6 && cc3 === 6 && cc4 === 6 && myHand.length < 6 && dealingAnimationFill)
            {
                localStorage.setItem("myHand", JSON.stringify(myHand.concat(myHandTrue[myHand.length])))
                setTimeout(() => {setMyHand(myHand.concat(myHandTrue[myHand.length]))}, 300)
            }
        }
    }, [myHand]);

    useEffect (() => {

        if (dealingAnimation || dealingAnimationFill)
        {
            if (cc3 < 9 && dealingAnimation)
            {
                localStorage.setItem("cc3", JSON.stringify(cc3 + 1))
                setTimeout(() => {setcc3(cc3 + 1)}, 100)
            }

            if (cc2 < 6 && dealingAnimationFill)
            {
                localStorage.setItem("cc2", JSON.stringify(cc2 + 1))
                setTimeout(() => {setcc2(cc2 + 1)}, 300)
            }

            if (cc2 === 6 && cc3 < 6 && dealingAnimationFill)
            {
                localStorage.setItem("cc3", JSON.stringify(cc3 + 1))
                setTimeout(() => {setcc3(cc3 + 1)}, 300)
            }

            if (cc2 === 6 && cc3 === 6 && cc4 < 6 && dealingAnimationFill)
            {
                localStorage.setItem("cc4", JSON.stringify(cc4 + 1))
                setTimeout(() => {setcc4(cc4 + 1)}, 300)
            }

            if (cc2 === 6 && cc3 === 6 && cc4 === 6 && myHand.length < 6 && dealingAnimationFill)
            {
                localStorage.setItem("myHand", JSON.stringify(myHand.concat(myHandTrue[myHand.length])))
                setTimeout(() => {setMyHand(myHand.concat(myHandTrue[myHand.length]))}, 300)
            }
        }

    }, [cc2]);

    useEffect (() => {
        
        if (dealingAnimation || dealingAnimationFill)
        {
            if (dealingAnimation && cc2 === 9 && cc3 === 9 && cc4 === 9 && myHand.length === 9)
            {
                localStorage.setItem("dealingAnimation", JSON.stringify(false))
                setDealingAnim(false)
            } 

            if (dealingAnimationFill && cc2 === 6 && cc3 === 6 && cc4 === 6 && myHand.length === 6)
            {
                localStorage.setItem("dealingAnimationFill", JSON.stringify(false))
                setDealingAnimFill(false)
                localStorage.setItem("RRD", JSON.stringify(true))
                setRenderRemainingDeck(true)

                
                if (cardsRemInDeck === 0)
                {
                    setTimeout(() => startPlay(), 2000)
                }
            } 
        }
    }, [cc2, cc3, cc4, myHand]);

    const loadFromStorage = () => {
        setMyHand(JSON.parse(localStorage.getItem("myHand")))
        setMyHandTrue(JSON.parse(localStorage.getItem("myHandTrue")))
        setDealerL(JSON.parse(localStorage.getItem("dealerLocal")))
        setcc2(JSON.parse(localStorage.getItem("cc2")))
        setcc3(JSON.parse(localStorage.getItem("cc3")))
        setcc4(JSON.parse(localStorage.getItem("cc4")))
        setDealingAnim(JSON.parse(localStorage.getItem("dealingAnimation")))
        setDealingAnimFill(JSON.parse(localStorage.getItem("dealingAnimationFill")))
        setHandMount(JSON.parse(localStorage.getItem("handMount")))
        setPc1(JSON.parse(localStorage.getItem("playedCard1")))
        setPc2(JSON.parse(localStorage.getItem("playedCard2")))
        setPc3(JSON.parse(localStorage.getItem("playedCard3")))
        setPc4(JSON.parse(localStorage.getItem("playedCard4")))
        setCD(JSON.parse(localStorage.getItem("currentDealer")))
        setWFD(JSON.parse(localStorage.getItem("waitForDealer")))
        setCB(JSON.parse(localStorage.getItem("currentBidder")))
        setBH(JSON.parse(localStorage.getItem("bidHolder")))
        setB(JSON.parse(localStorage.getItem("bid")))
        setBC(JSON.parse(localStorage.getItem("bidCycle")))
        setSC(JSON.parse(localStorage.getItem("suitCycle")))
        setBW(JSON.parse(localStorage.getItem("bidWinner")))
        setSuit(JSON.parse(localStorage.getItem("suit")))
        setDC(JSON.parse(localStorage.getItem("discCycle")))
        setCW(JSON.parse(localStorage.getItem("confirmedWaiting")))
        setFC(JSON.parse(localStorage.getItem("fillCycle")))
        setf1(JSON.parse(localStorage.getItem("fill1")))
        setf2(JSON.parse(localStorage.getItem("fill2")))
        setf3(JSON.parse(localStorage.getItem("fill3")))
        setf4(JSON.parse(localStorage.getItem("fill4")))
        setRenderRemainingDeck(JSON.parse(localStorage.getItem("RRD")))
        setFCA(JSON.parse(localStorage.getItem("flippedCardAvailable")))
        setFlippedCard(JSON.parse(localStorage.getItem("flippedCard")))
        setDeckPassedTo(JSON.parse(localStorage.getItem("passedTo")))
        setPassed(JSON.parse(localStorage.getItem("passed")))
        setCardsRemInDeck(JSON.parse(localStorage.getItem("cardsRemInDeck")))
        setPCF(JSON.parse(localStorage.getItem("playCycleFlag")))
        setW2P(JSON.parse(localStorage.getItem("waitingOn2Play")))
        setT1PTR(JSON.parse(localStorage.getItem("t1PtsThisRound")))
        setT2PTR(JSON.parse(localStorage.getItem("t2PtsThisRound")))
        setT1P(JSON.parse(localStorage.getItem("t1Pts")))
        setT2P(JSON.parse(localStorage.getItem("t2Pts")))
        setTrickWinner(JSON.parse(localStorage.getItem("trickWinner")))
        setTWC(JSON.parse(localStorage.getItem("trickWinnerCycle")))
        setGOF(JSON.parse(localStorage.getItem("gameOverFlag")))
        setWinningTeam(JSON.parse(localStorage.getItem("winningTeam")))
        setDisconnectedFlag(JSON.parse(localStorage.getItem("disconnectedFlag")))
        setUserDisconnected(JSON.parse(localStorage.getItem("userDisconnected")))
    }

    const setStorage = () => {
        localStorage.setItem("myHand", JSON.stringify([]))
        localStorage.setItem("myHandTrue", JSON.stringify([]))
        localStorage.setItem("dealerLocal", JSON.stringify(""))
        localStorage.setItem("cc2", JSON.stringify(0))
        localStorage.setItem("cc3", JSON.stringify(0))
        localStorage.setItem("cc4", JSON.stringify(0))
        localStorage.setItem("dealingAnimation", JSON.stringify(false))
        localStorage.setItem("dealingAnimationFill", JSON.stringify(false))
        localStorage.setItem("handMount", JSON.stringify(true))
        localStorage.setItem("playedCard1", JSON.stringify(""))
        localStorage.setItem("playedCard2", JSON.stringify(""))
        localStorage.setItem("playedCard3", JSON.stringify(""))
        localStorage.setItem("playedCard4", JSON.stringify(""))
        localStorage.setItem("currentDealer", JSON.stringify(""))
        localStorage.setItem("waitForDealer", JSON.stringify(false))
        localStorage.setItem("currentBidder", JSON.stringify(""))
        localStorage.setItem("bidHolder", JSON.stringify(""))
        localStorage.setItem("bid", JSON.stringify("0"))
        localStorage.setItem("bidCycle", JSON.stringify(false))
        localStorage.setItem("suitCycle", JSON.stringify(false))
        localStorage.setItem("bidWinner", JSON.stringify(""))
        localStorage.setItem("suit", JSON.stringify(""))
        localStorage.setItem("discCycle", JSON.stringify(false))
        localStorage.setItem("confirmedWaiting", JSON.stringify(false))
        localStorage.setItem("fillCycle", JSON.stringify(false))
        localStorage.setItem("fill1", JSON.stringify(0))
        localStorage.setItem("fill2", JSON.stringify(0))
        localStorage.setItem("fill3", JSON.stringify(0))
        localStorage.setItem("fill4", JSON.stringify(0))
        localStorage.setItem("RRD", JSON.stringify(false))
        localStorage.setItem("flippedCardAvailable", JSON.stringify(false))
        localStorage.setItem("flippedCard", JSON.stringify(""))
        localStorage.setItem("passedTo", JSON.stringify(""))
        localStorage.setItem("passed", JSON.stringify(false))
        localStorage.setItem("cardsRemInDeck", JSON.stringify(0))
        localStorage.setItem("playCycleFlag", JSON.stringify(false))
        localStorage.setItem("waitingOn2Play", JSON.stringify(""))
        localStorage.setItem("t1PtsThisRound", JSON.stringify(0))
        localStorage.setItem("t2PtsThisRound", JSON.stringify(0))
        localStorage.setItem("t1Pts", JSON.stringify(0))
        localStorage.setItem("t2Pts", JSON.stringify(0))
        localStorage.setItem("trickWinner", JSON.stringify(""))
        localStorage.setItem("trickWinnerCycle", JSON.stringify(false))
        localStorage.setItem("gameOverFlag", JSON.stringify(false))
        localStorage.setItem("winningTeam", JSON.stringify(-1))

    }

    const dealClick = () => {
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
              event: "UserDeal",
              gameCode: props.gameCode,
              uid: JSON.parse(localStorage.getItem("uid")),
              userName: props.username
            })
        }
    }

    const suitClick = (suit1) => {
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
              event: "SuitChoice",
              gameCode: props.gameCode,
              uid: JSON.parse(localStorage.getItem("uid")),
              userName: props.username,
              suitChoice: suit1
            })
        }

    }

    const confirmHandler = () => {
        if (myHand.length <= 6)
        {
            if (readyState === ReadyState.OPEN) {
                sendJsonMessage({
                event: "DiscChoice",
                gameCode: props.gameCode,
                uid: JSON.parse(localStorage.getItem("uid")),
                userName: props.username,
                handRem: myHand
                })
            }
            localStorage.setItem("discCycle", JSON.stringify(false))
            setDC(false)
            localStorage.setItem("confirmedWaiting", JSON.stringify(true))
            setCW(true)
    
        }
    }

    const passHandler = () => {
        if (!flippedCardAvailable)
        {
            if (readyState === ReadyState.OPEN) {
                sendJsonMessage({
                event: "PassDeck",
                gameCode: props.gameCode,
                uid: JSON.parse(localStorage.getItem("uid")),
                userName: props.username,
                })
            }
        }
    }


    const dealAnimation = () => {
        localStorage.setItem("dealingAnimation", JSON.stringify(true))
        setDealingAnim(true)
        handleDealOne()
    }


    const handleDealOne = () => {
        let dealIndex = (dealerLocal % 4) + 1

        if (dealIndex === 1) {
            localStorage.setItem("myHand", JSON.stringify(myHand.concat("card")))
            setMyHand(myHand.concat("card"))
        }

        if (dealIndex === 2) {
            var temp2 = cc2
            localStorage.setItem("cc2", JSON.stringify(temp2 + 1))
            setcc2(temp2 + 1)
        }
        if (dealIndex === 3) {
            var temp3 = cc3
            localStorage.setItem("cc3", JSON.stringify(temp3 + 1))
            setcc3(temp3 + 1)
        }
        if (dealIndex === 4) {
            var temp4 = cc4
            localStorage.setItem("cc4", JSON.stringify(temp4 + 1))
            setcc4(temp4 + 1)
        }
    }

    const flipACard = () => {
        if (!flippedCardAvailable)
        {
            if (readyState === ReadyState.OPEN) {
                sendJsonMessage({
                event: "FlipACard",
                gameCode: props.gameCode,
                uid: JSON.parse(localStorage.getItem("uid")),
                userName: props.username,
                })
            }
        }
    }

    const DragHandlerLate = (ref) => {
        setTimeout(DragHandler, 1, ref);
    }

    var EO = false;

    const DragHandler = (ref) => { 
        if (!EO)
        {
            if (!renderFor450)
            {
                let x = ref.current.getBoundingClientRect().x + document.documentElement.scrollLeft;
                let y = ref.current.getBoundingClientRect().y + document.documentElement.scrollTop;

                console.log("x: " + x)
                console.log("y: " + y)
                var pointArr;
                if (suit === "clubs")
                {
                    pointArr = PIC
                }
                if (suit === "spades")
                {
                    pointArr = PIS
                }
                if (suit === "hearts")
                {
                    pointArr = PIH
                }
                if (suit === "diamonds")
                {
                    pointArr = PID
                }

                var discAllowed = (pointArr.indexOf(flippedCard) === -1 && myHand.length === 6)

                if (y > 710 && y < 780 && x > 60 && x < 140 && discAllowed)
                {
                    EO = true
                    discAttemptFlipped()
                }
                else if (myHand.length < 6)
                {
                    var NewHand = myHand.concat(flippedCard)
                    localStorage.setItem("myHand", JSON.stringify(NewHand))
                    setMyHand(NewHand)
                    EO = true
                    localStorage.setItem("flippedCardAvailable", JSON.stringify(false))
                    setFCA(false)
                    localStorage.setItem("flippedCard", JSON.stringify(""))
                    setFlippedCard("")

                    if (readyState === ReadyState.OPEN) {
                        sendJsonMessage({
                        event: "ResetHand",
                        gameCode: props.gameCode,
                        uid: JSON.parse(localStorage.getItem("uid")),
                        userName: props.username,
                        myHand: NewHand
            
                        })
                    }

                    if (cardsRemInDeck === 0)
                    {
                        startPlay()
                    }
                }
                else
                {
                    localStorage.setItem("flippedCardAvailable", JSON.stringify(false))
                    setFCA(false)
                    localStorage.setItem("flippedCardAvailable", JSON.stringify(true))
                    setTimeout(() => setFCA(true), 2)
                }
            }
            else
            {
                let x = ref.current.getBoundingClientRect().x + document.documentElement.scrollLeft;
                let y = ref.current.getBoundingClientRect().y + document.documentElement.scrollTop;

                var pointArr;
                if (suit === "clubs")
                {
                    pointArr = PIC
                }
                if (suit === "spades")
                {
                    pointArr = PIS
                }
                if (suit === "hearts")
                {
                    pointArr = PIH
                }
                if (suit === "diamonds")
                {
                    pointArr = PID
                }

                var discAllowed = (pointArr.indexOf(flippedCard) === -1 && myHand.length === 6)

                if (y > 680 && y < 770 && x > -20 && x < 55 && discAllowed)
                {
                    EO = true
                    discAttemptFlipped()
                }
                else if (myHand.length < 6)
                {
                    var NewHand = myHand.concat(flippedCard)
                    localStorage.setItem("myHand", JSON.stringify(NewHand))
                    setMyHand(NewHand)
                    EO = true
                    localStorage.setItem("flippedCardAvailable", JSON.stringify(false))
                    setFCA(false)
                    localStorage.setItem("flippedCard", JSON.stringify(""))
                    setFlippedCard("")

                    if (readyState === ReadyState.OPEN) {
                        sendJsonMessage({
                        event: "ResetHand",
                        gameCode: props.gameCode,
                        uid: JSON.parse(localStorage.getItem("uid")),
                        userName: props.username,
                        myHand: NewHand
            
                        })
                    }

                    if (cardsRemInDeck === 0)
                    {
                        startPlay()
                    }
                }
                else
                {
                    localStorage.setItem("flippedCardAvailable", JSON.stringify(false))
                    setFCA(false)
                    localStorage.setItem("flippedCardAvailable", JSON.stringify(true))
                    setTimeout(() => setFCA(true), 2)
                }
            }
        }
    }

    const submitBid = (bid) => {
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
              event: "BidInfo",
              gameCode: props.gameCode,
              uid: JSON.parse(localStorage.getItem("uid")),
              userName: props.username,
              bid: bid

            })
        }
    }

    const startPlay = () => {
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
              event: "PlayingStartInfo",
              gameCode: props.gameCode,
              uid: JSON.parse(localStorage.getItem("uid")),
              userName: props.username,
              bid: bid

            })
        }
    }

    const playAgain = () => {
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
              event: "RestartGame",
              gameCode: props.gameCode,
              uid: JSON.parse(localStorage.getItem("uid")),
              userName: props.username
            })
        }
    }

    const playCard = (pos) => {
        var suitArr;
        if (suit === "spades")
        {
            suitArr = SPADES_INDS;
        }
        if (suit === "diamonds")
        {
            suitArr = DMDS_INDS;
        }
        if (suit === "clubs")
        {
            suitArr = CLUBS_INDS;
        }
        if (suit === "hearts")
        {
            suitArr = HEARTS_INDS;
        }
        if (suitArr.indexOf(myHand[pos]) !== -1)
        {
            if (readyState === ReadyState.OPEN) {
                sendJsonMessage({
                  event: "PlayedCardInfo",
                  gameCode: props.gameCode,
                  uid: JSON.parse(localStorage.getItem("uid")),
                  userName: props.username,
                  playedCard: myHand[pos]
                })
            }

            var handEdited =  myHand.slice()
            handEdited.splice(pos, 1)

            localStorage.setItem("handMount", JSON.stringify(false))
            setHandMount(false)

            localStorage.setItem("myHand", JSON.stringify(handEdited))
            setTimeout(() => setMyHand(handEdited), 2)
            
            localStorage.setItem("handMount", JSON.stringify(true))
            setTimeout(() => setHandMount(true), 2)
        }
        else
        {
            editOrder(pos,pos)
        }
    }

    const discAttemptFlipped = () => {
        localStorage.setItem("flippedCardAvailable", JSON.stringify(false))
        setFCA(false)
        localStorage.setItem("flippedCard", JSON.stringify(""))
        setFlippedCard("")

        if (cardsRemInDeck === 0)
        {
            startPlay()
        }
    }

    const discAttempt = (pos) => {

        var ptArr;
        if (suit === "spades")
        {
            ptArr = PIS;
        }
        if (suit === "diamonds")
        {
            ptArr = PID;
        }
        if (suit === "clubs")
        {
            ptArr = PIC;
        }
        if (suit === "hearts")
        {
            ptArr = PIH;
        }
        
        if (ptArr.indexOf(myHand[pos]) === -1)
        {
            var handEdited =  myHand.slice()
            handEdited.splice(pos, 1)

            localStorage.setItem("handMount", JSON.stringify(false))
            setHandMount(false)

            localStorage.setItem("myHand", JSON.stringify(handEdited))
            setTimeout(() => setMyHand(handEdited), 2)
            
            localStorage.setItem("handMount", JSON.stringify(true))
            setTimeout(() => setHandMount(true), 2)
        }
        else
        {
            editOrder(pos,pos)
        }
    }

    const editOrder = (pos1, pos2) => {

        var handEdited =  myHand.slice()
        var handCurr =  myHand.slice()

        var posI;
        if (pos1 < pos2)
        {
            
            for (posI = pos1; posI < pos2; posI++)
            {
                handEdited[posI] = handCurr[posI + 1]    
            }

            handEdited[pos2] = handCurr[pos1]
        }

        if (pos1 > pos2)
        {
            for (posI = pos1; posI > pos2; posI--)
            {
                handEdited[posI] = handCurr[posI - 1]
            }

            handEdited[pos2] = handCurr[pos1]

            
        }

        localStorage.setItem("handMount", JSON.stringify(false))
        setHandMount(false)
        
        localStorage.setItem("myHand", JSON.stringify(handEdited))
        setTimeout(() => setMyHand(handEdited), 2)
        
        localStorage.setItem("handMount", JSON.stringify(true))
        setTimeout(() => setHandMount(true), 2)


    }

    const doNothing = () => {

    }


    let playedImage1;
    let playedImage2;
    let playedImage3;
    let playedImage4;
    let handRendered;
    let tcan;
    let drag2play;
    let cardBackDeck;
    let clickToFlip;
    let dragToHand;
    let sixMaxInfo;
    let flippedCardRender;
    let infoWhosGettingCards;
    let scoreCard;
    let overlay;
    let winnerCard;
    let disconnectedPage;
    let chatBox = <ChatBox 
                    gameCode = {props.gameCode}
                    username = {props.username}>
                    </ChatBox>
    
    if (handMount)
    {
        handRendered = <Hand discAttempt = {discAttempt} 
                             hand = {myHand} 
                             handMount = {handMount} 
                             editOrder = {editOrder} 
                             username = {props.username} 
                             gameCode = {props.gameCode} 
                             discCycle = {discCycle}
                             fca = {flippedCardAvailable}
                             playCard = {playCard}
                             waitingOn2Play = {waitingOn2Play}
                             playCycleFlag = {playCycleFlag}
                             myspot = {props.myspot}>
                             </Hand>
    }

    if (playedCard3 !== "")
    {
        playedImage1 = <img src = {process.env.PUBLIC_URL + playedCard3 + ".png"} className = "pc1" alt = "pc1"/>
    }
    if (playedCard4 !== "")
    {
        playedImage2 = <img src = {process.env.PUBLIC_URL + playedCard4 + ".png"} className = "pc2" alt = "pc2"/>
    }
    if (playedCard1 !== "")
    {
        playedImage3 = <img src = {process.env.PUBLIC_URL + playedCard1 + ".png"} className = "pc3" alt = "pc3"/>
    }
    if (playedCard2 !== "")
    {
        playedImage4 = <img src = {process.env.PUBLIC_URL + playedCard2 + ".png"} className = "pc4" alt = "pc4"/>
    }
    if (discCycle === true)
    {
        tcan = <div className = "tcanWrapper"><div className = "discDiv">Drag Here To Discard</div><img src = {tcanPic} className = "tcan" alt = "tcan"/></div>
    }
    if (waitingOn2Play === parseInt(props.myspot, 10)) 
    {
        drag2play = <div className = "d2pDiv">Drag Here To Play</div>
    }
    if (RRD)
    {
        if ((bidWinner === parseInt(props.myspot, 10) && !passed) || passedTo === parseInt(props.myspot, 10) )
        {
            if (cardsRemInDeck === 0)
            {
                clickToFlip = <div className = "c2fDiv">No cards left in deck!</div>

            }
            else
            {
                clickToFlip = <div className = "c2fDiv">Click the deck to flip a card</div>
                cardBackDeck = <img src = {CardBack} onClick={() => flipACard()} className = "cardBackRRD" alt = "cardBackRRD"/>
            }
            
            dragToHand = <div className = "d2hDiv">Drag to your hand or discard</div>
            sixMaxInfo = <div className = "sixOnlyDiv">You can only have 6 cards in your hand</div>
            tcan = <div className = "tcanWrapper"><div className = "discDiv">Drag Here To Discard</div><img src = {tcanPic} className = "tcan" alt = "tcan"/></div>
        }
        else
        {
            const userStrings = [props.user1, props.user2, props.user3, props.user4]
            if (!renderFor450)
            {
                cardBackDeck = <img src = {CardBack} onClick={() => doNothing()} className = "cardBackRRD" alt = "cardBackRRD" style = {{left: "530px"}}/>
            }
            else
            {
                cardBackDeck = <img src = {CardBack} onClick={() => doNothing()} className = "cardBackRRD" alt = "cardBackRRD" style = {{left: "150px"}}/>
            }
            if (!passed)
            {
                infoWhosGettingCards= <div className = "iwgc">{userStrings[parseInt(bidWinner, 10) - 1]} {"gets the deck"}</div>
            }
            else
            {
                infoWhosGettingCards= <div className = "iwgc">{userStrings[parseInt(bidWinner, 10) - 1]} {"passed the deck"}</div>
            }
        }

        if (flippedCardAvailable)
        {
            EO = false
            let nodeRef = React.createRef();
            flippedCardRender = <Draggable nodeRef = {nodeRef} onStop = {() => DragHandlerLate(nodeRef)}><img ref = {nodeRef} src = {process.env.PUBLIC_URL + flippedCard + ".png"} className = "cardRRD" alt = "king1" style = {{transform: "translate(0,0)"}}/></Draggable>

        }
        
    }
    if (playCycleFlag || true)
    {
        scoreCard = <ScoreCard 
                        user1 = {props.user1}
                        user2 = {props.user2}
                        user3 = {props.user3}
                        user4 = {props.user4}
                        t1Pts = {t1Pts}
                        t2Pts = {t2Pts}
                        t1PtsThisRound = {t1PtsThisRound}
                        t2PtsThisRound = {t2PtsThisRound}
                        bid = {bid}
                        suit = {suit}
                        playCycleFlag = {playCycleFlag}
                        fillCycle = {fillCycle}
                        discCycle = {discCycle}
                        bidWinner = {bidWinner}
                        confirmedWaiting = {confirmedWaiting}
                        ></ScoreCard>
    }
    if (gameOverFlag)
    {
        overlay = <div className = "overlay"></div>
        winnerCard = <WinnerCard
                        user1 = {props.user1}
                        user2 = {props.user2}
                        user3 = {props.user3}
                        user4 = {props.user4}
                        lcode1 = {props.lcode1}
                        lcode2 = {props.lcode2}
                        lcode3 = {props.lcode3}
                        lcode4 = {props.lcode4}
                        playAgain = {() => playAgain()}
                        gameOverFlag = {gameOverFlag}
                        winningTeam = {winningTeam}
                        ></WinnerCard>
    }
    if (disconnectedFlag)
    {
        overlay = <div className = "overlay"></div>
        disconnectedPage = <DisconnectedPage
                            userDisconnect = {userDisconnected}
                            ></DisconnectedPage>
    }
    return (
        <div className = "container">
            <div  className = "otherHand1">
                <OtherHand cardCount = {cc3}></OtherHand>
            </div>
            <div  className = "otherHand2">
                <OtherHand cardCount = {cc2}></OtherHand>
            </div>
            <div  className = "otherHand3">
                <OtherHand cardCount = {cc4}></OtherHand>
            </div>
            {/* <img src = {TablePic} className = "table" alt = "table"/> */}
            <div className = "myHand">
            {handRendered}
            </div>
            {overlay}
            {winnerCard}
            {disconnectedPage}
            <div className = "avatar3">
                <div style = {{marginLeft: 'auto', marginRight: 'auto', width: 'fit-content'}}>
                    <AvatarIcon codeKey = {localL3}
                                    width = {avatarWidth}
                                    height = {avatarWidth}
                                    handleAvatarClick = {() => doNothing()}></AvatarIcon>
                </div>
                <div className = 'usernameDiv'>{localUser3}</div>
            </div>
            <div className = "avatar1">
                <div style = {{marginLeft: 'auto', marginRight: 'auto', width: 'fit-content'}}>
                    <AvatarIcon codeKey = {localL1}
                                    width = {avatarWidth}
                                    height = {avatarWidth}  
                                    handleAvatarClick = {() => doNothing()}></AvatarIcon>
                </div>
                <div className = 'usernameDiv'>{localUser1}</div>
            </div>
            <div className = "avatar2">
                <div style = {{marginLeft: 'auto', marginRight: 'auto', width: 'fit-content'}}>
                    <AvatarIcon codeKey = {localL2}
                                    width = {avatarWidth}
                                    height = {avatarWidth} 
                                    handleAvatarClick = {() => doNothing()}></AvatarIcon>
                </div>
                <div className = 'usernameDiv'>{localUser2}</div>
            </div>
            <div className = "avatar4">
                <div style = {{marginLeft: 'auto', marginRight: 'auto', width: 'fit-content'}}>
                    <AvatarIcon codeKey = {localL4}
                                    width = {avatarWidth}
                                    height = {avatarWidth} 
                                    handleAvatarClick = {() => doNothing()}></AvatarIcon>
                </div>
                <div className = 'usernameDiv'>{localUser4}</div>
            </div>
            {chatBox}
            {playedImage1}
            {playedImage2}
            {playedImage3}
            {playedImage4}
            {tcan}
            {drag2play}
            {cardBackDeck}
            {clickToFlip}
            {dragToHand}
            {sixMaxInfo}
            {flippedCardRender}
            {infoWhosGettingCards}
            {scoreCard}
            <BidButton handleBidClick = {submitBid} 
                       username = {props.username} 
                       gameCode = {props.gameCode} 
                       user1 = {props.user1}
                       user2 = {props.user2}
                       user3 = {props.user3}
                       user4 = {props.user4}
                       myspot = {props.myspot}
                       dealHandler = {() => dealClick()}
                       wfd = {waitForDealer}
                       dealinganim = {dealingAnimation}
                       currentDealer = {currentDealer}
                       bid = {bid}
                       currentBidder = {currentBidder}
                       bidHolder = {bidHolder}
                       bidCycle = {bidCycle}
                       suitCycle = {suitCycle}
                       bidWinner = {bidWinner}
                       discCycle = {discCycle}
                       suit = {suit}
                       handleSuitClick = {suitClick}
                       confirmHandler = {confirmHandler}
                       confirmedWaiting = {confirmedWaiting}
                       passed = {passed}
                       passHandler = {passHandler}
                       fillCycle = {fillCycle}
                       fill1 = {fill1}
                       fill2 = {fill2}
                       fill3 = {fill3}
                       fill4 = {fill4}
                       waitingOn2Play = {waitingOn2Play}
                       playCycleFlag = {playCycleFlag}
                       trickWinner = {trickWinner}
                       trickWinnerCycle = {trickWinnerCycle}></BidButton>
        </div>
    );
};

export default GamePage