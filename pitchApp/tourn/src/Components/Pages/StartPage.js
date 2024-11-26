import React, { useEffect, useState } from 'react';
import "./StartPage.css";
import TablePic from "./table.png"
import AvatarBar from "../AvatarBar/AvatarBar"
import useWebSocket, { ReadyState } from 'react-use-websocket';
import AvatarIcon from '../AvatarIcon/AvatarIcon';
const WS_URL = "wss://tourneyrules.app/StartPageSocket"

function StartPage(props) {
    const [renderJoinStart, setRenderJoinStart] = useState(false);
    const [renderUserNameBar, setRenderUserNameBar] = useState(true);
    const [renderAvatarChoiceBar, setRenderAvatarChoiceBar] = useState(false);
    const [renderJoinUI, setRenderJoinUI] = useState(false);
    const [joined, setJoined] = useState(false);
    const [gameNotFound, setGNF] = useState(false);

    const { sendJsonMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
        onOpen: () => {
          console.log("StartPageSocket connection established.");
        },
        onClose: () => {
            if (readyState === ReadyState.OPEN) {
                sendJsonMessage({
                  event: "closeStartPageWS",
                  gameCode: props.gameCode
                })
              }
        },
         // filter: () => false,
        retryOnError: true,
        shouldReconnect: () => true,
        
      });
  

      


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
        console.log("Connection state changed to StartPageSocket")
        if (readyState === ReadyState.OPEN && JSON.parse(localStorage.getItem("uid")) === null) {
            sendJsonMessage({
              event: "openSocket"
            })
        }
        if (readyState === ReadyState.OPEN && JSON.parse(localStorage.getItem("uid")) !== null) {
            sendJsonMessage({
                event: "updateSocketConnection",
                uid: JSON.parse(localStorage.getItem("uid"))
            })
        }

      }, [readyState])

      useEffect(() => {
        const listener = event => {
          if (event.code === "Enter" || event.code === "NumpadEnter") {
            event.preventDefault();
            enterHandler();
 
        }
        };
        document.addEventListener("keydown", listener);
        return () => {
          document.removeEventListener("keydown", listener);
        };
      }, [renderUserNameBar, renderJoinStart, props.gameCode]);

      useEffect(() => {
        if (lastMessage !== null)
        {

            
            var data = lastMessage.data;
            data = data.replace(/'/g, '"');
            data = JSON.parse(data);
            console.log(data)

            if (data["event"] === "uidPush")
            {
                localStorage.setItem("uid", JSON.stringify(data["uid"]))
            }

            if (data["event"] === "noGameForUid")
            {
                // setStorage()
                loadFromStorage()
                props.setHomeStorage()
                props.loadHomeFromStorage()
            }

            if (data["event"] === "spotPush")
            {
                for (var i = 1; i < 5; i++)
                {
                    var text1 = "user"
                    var text2 = "lcode"
                    const userString = text1.concat(i.toString()) 
                    const logoString = text2.concat(i.toString()) 
                    if (data[userString] !== "")
                    {
                        props.setUsers(i, data[userString])
                        props.setLogos(i, data[logoString])
                    }
                }
            }

            if (data["event"] === "gameExistsPush")
            {
                if (data["gameExists"])
                {
                    joinFully()
                }
                else
                {
                    localStorage.setItem("gameNotFound", JSON.stringify(true))
                    setGNF(true)
                }
            }

            if (data["event"] === "beginGamePush")
            {
                props.beginGame()
            }
        }
      }, [lastMessage])

    const loadFromStorage = () => {
        setRenderJoinStart(JSON.parse(localStorage.getItem("renderJoinStart")))
        setRenderUserNameBar(JSON.parse(localStorage.getItem("renderUserNameBar")))
        setRenderAvatarChoiceBar(JSON.parse(localStorage.getItem("renderAvatarChoiceBar")))
        setRenderJoinUI(JSON.parse(localStorage.getItem("renderJoinUI")))
        setJoined(JSON.parse(localStorage.getItem("joined")))
        setGNF(JSON.parse(localStorage.getItem("gameNotFound")))
    }

    const setStorage = () => {
        localStorage.setItem("renderJoinStart", JSON.stringify(false))
        localStorage.setItem("renderUserNameBar", JSON.stringify(true))
        localStorage.setItem("renderAvatarChoiceBar", JSON.stringify(false))
        localStorage.setItem("renderJoinUI", JSON.stringify(false))
        localStorage.setItem("joined", JSON.stringify(false))
        localStorage.setItem("gameNotFound", JSON.stringify(false))
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

    const enterHandler = () => {
        if (renderUserNameBar)
        {
            searchgo();
        }
        if (renderJoinStart)
        {
            handleJoinClick();
        }
    }

    const searchHandler = (event) => {
        props.setUsername(event)
    }

    const joinHandler = (event) => {
        props.setGameCode(event)
    }

    const startGame = () => {
        const cardsApiUrl = 'https://tourneyrules.app/makeGameFile/'
        fetch(cardsApiUrl).then((response) => response.json()).then((data) => {
            props.setGameCodeOnStart(data.gameCode);
            props.setLobbyLeader();
            const result = data.gameCode;
            return result
            }).then((result) => registerForGame(result))
    }

    const handleStartClick = () => {
        startGame();
        localStorage.setItem("renderJoinStart", JSON.stringify(false))
        setRenderJoinStart(false);
        localStorage.setItem("renderJoinUI", JSON.stringify(true))
        setRenderJoinUI(true);
    }

    const registerForGame = (result) => {
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
              event: "registerForGame",
              uid: JSON.parse(localStorage.getItem("uid")),
              gameCode: result
            })
          }
    }

    const checkIfGameExists = (result) => {
        localStorage.setItem("gameNotFound", JSON.stringify(false))
        setGNF(false)
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
              event: "gameCheck",
              gameCode: result
            })
          }
    }

    const joinFully = () => {
        localStorage.setItem("renderJoinStart", JSON.stringify(false))
        setRenderJoinStart(false);
        localStorage.setItem("renderJoinUI", JSON.stringify(true))
        setRenderJoinUI(true);
        registerForGame(props.gameCode)
    }

    const handleJoinClick = () => {
        checkIfGameExists(props.gameCode);
    }

    const handleSpotClick = (spot) => {
        if (!joined) {
            if (readyState === ReadyState.OPEN) {
                sendJsonMessage({
                  event: "spotDecision",
                  gameCode: props.gameCode,
                  uid: JSON.parse(localStorage.getItem("uid")),
                  userName: props.username,
                  logoCode: props.logoCode,
                  spotChoice: String(spot),
                })
              }
            localStorage.setItem("joined", JSON.stringify(true))
            setJoined(true)
            props.setMySpot(spot)
        }
    }

    const handleBeginClick = () => {

        if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
              event: "beginGame",
              gameCode: props.gameCode,
              userName: props.username,
            })
          }
    }

    const handleAvatarClickLocal = (avatarId) => {
        props.handleAvatarClick(avatarId)
        avatargo()
    }

    const searchgo = () => {
        localStorage.setItem("renderAvatarChoiceBar", JSON.stringify(true))
        setRenderAvatarChoiceBar(true)
        localStorage.setItem("renderUserNameBar", JSON.stringify(false))
        setRenderUserNameBar(false)
    }

    const avatargo = () => {
        localStorage.setItem("renderAvatarChoiceBar", JSON.stringify(false))
        setRenderAvatarChoiceBar(false)
        localStorage.setItem("renderJoinStart", JSON.stringify(true))
        setRenderJoinStart(true)
    }

    const doNothing = () => {

    }

    let userBar;
    let avatarBar
    let goButton;
    let StartButton;
    let JoinButton;
    let joinBar;
    let orDiv;
    let joinUI;
    let beginButton;
    let GNFmessage;

    if (gameNotFound) {
        GNFmessage = <div className = "GNFdiv">game not found!</div>
    }
    if (renderUserNameBar) {
        userBar = <form className="form1" id="searchform">
            <input
                type="text"
                className="inputSearch"
                id="addInput"
                placeholder="Enter  a Username..."
                onChange={searchHandler}
            />
        </form>
        goButton = <div className="gobutton" onClick = {() => searchgo()}><button style = {{fontFamily: 'arcadeclassic'}}>SUBMIT</button></div>
    }
    if (renderAvatarChoiceBar) {
        avatarBar = <AvatarBar handleAvatarClick = {handleAvatarClickLocal}>
                        </AvatarBar>
    }
    if (renderJoinStart) {
        StartButton = <div className = "startDiv"><button onClick = {() => handleStartClick()} className = "startButton">Start Game</button></div>
        joinBar = <form className="form2" id="searchform">
        <input
            type="text"
            className="inputJoin"
            id="addInput"
            placeholder="Enter a Game Code..."
            onChange={joinHandler}
        />
    </form>
        orDiv = <div className = "orclass">OR</div>
        JoinButton = <div className = "joinDiv"><button onClick = {() => handleJoinClick()} className = "joinButton">Join Game</button></div>
    }

    if (renderJoinUI) {

        let userCard3 = <div className = "joinFieldA3"><button onClick = {() => handleSpotClick(3)} className = "spotButton">Join Game</button></div>
        let userCard2 = <div className = "joinFieldA2"><button onClick = {() => handleSpotClick(2)} className = "spotButton">Join Game</button></div>
        let userCard4 = <div className = "joinFieldA4"><button onClick = {() => handleSpotClick(4)} className = "spotButton">Join Game</button></div>
        let userCard1 = <div className = "joinFieldA1"><button onClick = {() => handleSpotClick(1)} className = "spotButton">Join Game</button></div>
        
        var renderFor450 = window.screen.width <= 450;
        var mytop;
        var myleft;

        if (props.user3 !== "") {
            if (renderFor450)
            {
              mytop = '74px'
              myleft = '158px'
            }
            else
            {
              mytop = '78px'
              myleft = '225px'
            }
            userCard3 = 
            <div className = "memefield" style = {{position: 'absolute', top: mytop, left: myleft}}>
                <div style = {{display: 'inline-block', width: 'fit-content', height: 'fit-content'}}>
                    <AvatarIcon codeKey = {props.lcode3}
                                width = '45px' 
                                height = '45px' 
                                style = {{display: 'inline-block'}} 
                                handleAvatarClick = {() => doNothing()}>
                    </AvatarIcon>
                </div>
                <div className = "otherUser">{props.user3}
                </div>
            </div>
        }

        if (props.user2 !== "") {
            if (renderFor450)
            {
                mytop = '150px'
                myleft = '220px'
            }
            else
            {
                mytop = '150px'
                myleft = '305px'
            }
            userCard2 = 
            <div className = "joinField2" style = {{position: 'absolute', top: mytop, right: myleft}}>
                <div className = "otherUser" >{props.user2}
                </div>
                <div style = {{display: 'inline-block', width: 'fit-content', height: 'fit-content'}}>
                    <AvatarIcon codeKey = {props.lcode2}
                                width = '45px' 
                                height = '45px' 
                                style = {{display: 'inline-block'}} 
                                handleAvatarClick = {() => doNothing()}>
                    </AvatarIcon>
                </div>
            </div>
        }

        if (props.user4 !== "") {
            if (renderFor450)
            {
                mytop = '150px'
                myleft = '230px'
            }
            else
            {
                mytop = '150px'
                myleft = '303px'
            }
            userCard4 = 
            <div className = "joinField2" style = {{position: 'absolute', top: mytop, left: myleft}}>
                <div style = {{display: 'inline-block', width: 'fit-content', height: 'fit-content'}}>
                    <AvatarIcon codeKey = {props.lcode4}
                                width = '45px' 
                                height = '45px' 
                                style = {{display: 'inline-block'}} 
                                handleAvatarClick = {() => doNothing()}>
                    </AvatarIcon>
                </div>
                <div className = "otherUser">{props.user4}
                </div>
            </div>
        }

        if (props.user1 !== "") {
            console.log(props.lcode1)
            if (renderFor450)
            {
                mytop = '230px'
                myleft = '150px'
            }
            else
            {
                mytop = '225px'
                myleft = '225px'
            }
            userCard1 = 
            <div className = "joinField2" style = {{position: 'absolute', top: mytop, right: myleft}}>
                <div className = "otherUser">{props.user1}
                </div>
                <div style = {{display: 'inline-block', width: 'fit-content', height: 'fit-content'}}>
                    <AvatarIcon codeKey = {props.lcode1}
                                width = '45px' 
                                height = '45px' 
                                style = {{display: 'inline-block'}} 
                                handleAvatarClick = {() => doNothing()}>
                    </AvatarIcon>
                </div>
            </div>
        }

        if ((props.user1 !== "" && props.user2 !== "" && props.user3 !== "" && props.user4 !== "")) {
            beginButton = <div className = "beginDiv"><button onClick = {() => handleBeginClick()} className = "beginButton">Start Game</button></div>
        }   
        joinUI = <div className = "joinUIclass">
            {userCard3}
            {userCard4}
            <img src = {TablePic} className = "table1" alt = "table"/>
            {userCard2}
            {userCard1}
            <div className = "gameCodeDisplay">Game Code: {props.gameCode}</div>
            {beginButton}
        </div>
    }

    return (
        <div className = "startPage">
            <div className = "startGameCard"  style = {{overflow: "hidden"}}>
                <div className = "tourneyDiv">Tourney Rules.</div>
                {userBar}
                {avatarBar}
                {goButton}
                {StartButton}
                {orDiv}
                {joinBar}
                {JoinButton}
                {joinUI}
                {GNFmessage}
            </div>
        </div>
    );
};

export default StartPage