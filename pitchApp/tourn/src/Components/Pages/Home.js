import React, { Component, useEffect, useState } from 'react';
import GamePage from './GamePage';
import StartPage from './StartPage';


class Home extends Component {

    constructor(props) {
        super(props);
        this.setLobbyLeader = this.setLobbyLeader.bind(this)
        this.setGameCodeOnStart = this.setGameCodeOnStart.bind(this)
        this.setUsername = this.setUsername.bind(this)
        this.setGameCode = this.setGameCode.bind(this)
        this.beginGame = this.beginGame.bind(this)
        this.setUsers = this.setUsers.bind(this)
        this.setLogos = this.setLogos.bind(this)
        this.handleAvatarClick = this.handleAvatarClick.bind(this)
        this.setMySpot = this.setMySpot.bind(this)
        this.loadFromStorage = this.loadFromStorage.bind(this)
        this.setStorage = this.setStorage.bind(this)
        this.state = {
            gameCode: "",
            username: "",
            user1: "",
            user2: "",
            user3: "",
            user4: "",
            lobbyLeader: false,
            gameStarted: false,
            avatar: -1,
            lcode1: "",
            lcode2: "",
            lcode3: "",
            lcode4: "",
            myspot: "",
            spotMap: [],
        }
    }

    componentDidMount() {
        // localStorage.clear()
        if (localStorage.getItem("uid") != null)
        {
            this.loadFromStorage()
            
        }
        else
        {
            this.setStorage()
        }
    }

    loadFromStorage() {
        this.setState({gameCode: JSON.parse(localStorage.getItem("gameCode"))})
        this.setState({username: JSON.parse(localStorage.getItem("username"))})
        this.setState({user1: JSON.parse(localStorage.getItem("user1"))})
        this.setState({user2: JSON.parse(localStorage.getItem("user2"))})
        this.setState({user3: JSON.parse(localStorage.getItem("user3"))})
        this.setState({user4: JSON.parse(localStorage.getItem("user4"))})
        this.setState({avatar: JSON.parse(localStorage.getItem("avatar"))})
        this.setState({gameCode: JSON.parse(localStorage.getItem("gameCode"))})
        this.setState({spotMap: JSON.parse(localStorage.getItem("spotMap"))})
        this.setState({lcode1: JSON.parse(localStorage.getItem("lcode1"))})
        this.setState({lcode2: JSON.parse(localStorage.getItem("lcode2"))})
        this.setState({lcode3: JSON.parse(localStorage.getItem("lcode3"))})
        this.setState({lcode4: JSON.parse(localStorage.getItem("lcode4"))})
        this.setState({myspot: JSON.parse(localStorage.getItem("myspot"))})
        this.setState({gameStarted: JSON.parse(localStorage.getItem("gameStarted"))})
    }

    setStorage() {
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
        localStorage.setItem("userDisconnected", JSON.stringify(""))
        localStorage.setItem("disconnectedFlag", JSON.stringify(false))
        localStorage.setItem("winningTeam", JSON.stringify(-1))
        localStorage.setItem("gameCode", JSON.stringify(""))
        localStorage.setItem("username", JSON.stringify(""))
        localStorage.setItem("user1", JSON.stringify(""))
        localStorage.setItem("user2", JSON.stringify(""))
        localStorage.setItem("user3", JSON.stringify(""))
        localStorage.setItem("user4", JSON.stringify(""))
        localStorage.setItem("gameStarted", JSON.stringify(false))
        localStorage.setItem("avatar", JSON.stringify(-1))
        localStorage.setItem("gameCode", JSON.stringify(""))
        localStorage.setItem("lcode1", JSON.stringify(""))
        localStorage.setItem("lcode2", JSON.stringify(""))
        localStorage.setItem("lcode3", JSON.stringify(""))
        localStorage.setItem("lcode4", JSON.stringify(""))
        localStorage.setItem("myspot", JSON.stringify(""))
        localStorage.setItem("spotMap", JSON.stringify([]))
    }

    beginGame() {
        localStorage.setItem("gameStarted", JSON.stringify(true))
        this.setState({gameStarted: true})
    }

    setUsers(spot, username) {
        if (spot === 1) {
            localStorage.setItem("user1", JSON.stringify(username))
            this.setState({user1: username});
        }
        if (spot === 2) {
            localStorage.setItem("user2", JSON.stringify(username))
            this.setState({user2: username});
        }
        if (spot === 3) {
            localStorage.setItem("user3", JSON.stringify(username))
            this.setState({user3: username});
        }
        if (spot === 4) {
            localStorage.setItem("user4", JSON.stringify(username))
            this.setState({user4: username});
        }
        
    }

    setMySpot(spot) {
        localStorage.setItem("myspot", JSON.stringify(String(spot)))
        this.setState({myspot: String(spot)});
        localStorage.setItem("spotMap", JSON.stringify([(spot - 1) % 4 + 1, spot % 4 + 1, (spot + 1) % 4 + 1, (spot + 2) % 4 + 1]))
        this.setState({spotMap: [(spot - 1) % 4 + 1, spot % 4 + 1, (spot + 1) % 4 + 1, (spot + 2) % 4 + 1]})  
    }

    setLogos(spot, logoCode) {
        if (spot === 1) {
            localStorage.setItem("lcode1", JSON.stringify(logoCode))
            this.setState({lcode1: logoCode});
        }
        if (spot === 2) {
            localStorage.setItem("lcode2", JSON.stringify(logoCode))
            this.setState({lcode2: logoCode});
        }
        if (spot === 3) {
            localStorage.setItem("lcode3", JSON.stringify(logoCode))
            this.setState({lcode3: logoCode});
        }
        if (spot === 4) {
            localStorage.setItem("lcode4", JSON.stringify(logoCode))
            this.setState({lcode4: logoCode});
        }
    }

    setLobbyLeader() {
        this.setState({lobbyLeader: true});
    }

    setGameCodeOnStart(gameCodeIn) {
        localStorage.setItem("gameCode", JSON.stringify(gameCodeIn))
        this.setState({gameCode: gameCodeIn});
    }

    setGameCode(event) {
        localStorage.setItem("gameCode", JSON.stringify(event.target.value))
        this.setState({ gameCode: event.target.value })
    }


    setUsername(event) {
        localStorage.setItem("username", JSON.stringify(event.target.value))
        this.setState({ username: event.target.value })
    }

    handleAvatarClick(avatarId) {
        localStorage.setItem("avatar", JSON.stringify(avatarId))
        this.setState({ avatar:  avatarId })
    }

    render() {
        let gPage;
        let sPage;

        if (!this.state.gameStarted) {
            sPage = <StartPage 
                                username = {this.state.username}
                                setLobbyLeader = {this.setLobbyLeader} 
                                setLogos = {this.setLogos} 
                                setGameCodeOnStart = {this.setGameCodeOnStart}
                                setUsername = {this.setUsername} 
                                setGameCode = {this.setGameCode}
                                beginGame = {this.beginGame}
                                setUsers = {this.setUsers}
                                handleAvatarClick = {this.handleAvatarClick}
                                gameCode = {this.state.gameCode} 
                                logoCode = {this.state.avatar}
                                user1 = {this.state.user1}
                                user2 = {this.state.user2}
                                user3 = {this.state.user3}
                                user4 = {this.state.user4}
                                lcode1 = {this.state.lcode1}
                                lcode2 = {this.state.lcode2}
                                lcode3 = {this.state.lcode3}
                                lcode4 = {this.state.lcode4}
                                setMySpot = {this.setMySpot}
                                setHomeStorage = {this.setStorage}
                                loadHomeFromStorage = {this.loadFromStorage}>
                                </StartPage>
        }
        else {
            gPage = <GamePage
                            gameCode = {this.state.gameCode} 
                            username = {this.state.username}
                            user1 = {this.state.user1}
                            user2 = {this.state.user2}
                            user3 = {this.state.user3}
                            user4 = {this.state.user4}
                            lcode1 = {this.state.lcode1}
                            lcode2 = {this.state.lcode2}
                            lcode3 = {this.state.lcode3}
                            lcode4 = {this.state.lcode4}
                            myspot = {this.state.myspot}
                            spotmap = {this.state.spotMap}
                            setHomeStorage = {this.setStorage}
                            loadHomeFromStorage = {this.loadFromStorage}>
                            </GamePage> 
        }
        return (
            <div className = "appmain">
            {gPage}
            {sPage}
          </div>
        );
    }
};

export default Home