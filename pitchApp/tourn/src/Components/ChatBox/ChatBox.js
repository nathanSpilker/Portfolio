import React, { useEffect, useState} from 'react';
import "./ChatBox.css";
import useWebSocket, { ReadyState } from 'react-use-websocket';
const WS_URL = "wss://tourneyrules.app/ChatSocket"

function ChatBox(props) {

    const [cm1, setcm1] = useState("");
    const [cm2, setcm2] = useState("");
    const [cm3, setcm3] = useState("");
    const [cm4, setcm4] = useState("");
    const [cm5, setcm5] = useState("");
    const [cm6, setcm6] = useState("");
    const [cm7, setcm7] = useState("");
    const [u1, setu1] = useState("");
    const [u2, setu2] = useState("");
    const [u3, setu3] = useState("");
    const [u4, setu4] = useState("");
    const [u5, setu5] = useState("");
    const [u6, setu6] = useState("");
    const [u7, setu7] = useState("");
    const [connected, setConnected] = useState(false);
    const [chatMessage, setChatMessage] = useState("")

    let chatBar;
    let sendButton;
    let m1; 
    let m2;
    let m3;
    let m4;
    let m5;
    let m6;
    let m7;

    let u1t;
    let u2t;
    let u3t;
    let u4t;
    let u5t;
    let u6t;
    let u7t;

    let r1;
    let r2;
    let r3;
    let r4;
    let r5;
    let r6;
    let r7;

    const { sendJsonMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
        onOpen: () => {
            console.log("ChatSocket connection established.");
        },
        onClose: () => {
            // if (readyState === ReadyState.OPEN) {
            //     sendJsonMessage({
            //         event: "closeChatWS",
            //         gameCode: props.gameCode,
            //     })
            // }
        },
            // filter: () => false,
        retryOnError: true,
        // shouldReconnect: () => true,
    
    });

    useEffect(() => {
        console.log("Connection state changed to ChatSocket")
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
            event: "RegisterForChat",
            gameCode: props.gameCode,
            uid: JSON.parse(localStorage.getItem("uid")),
            userName: props.username
            })
        }
      }, [readyState])

    useEffect(() => {
        if (lastMessage !== null)
        {
            var data = lastMessage.data;
            data = data.replace(/'/g, '"');
            data = JSON.parse(data);
            console.log(data)
            if (data["event"] === "chatPush")
            {
                setChat(data["chat"], data["userChatted"])
            }
        }
      }, [lastMessage])
      
    useEffect(() => {
        const listener = event => {
          if (event.code === "Enter" || event.code === "NumpadEnter") {
            console.log("Enter key was pressed. Run your function.");
            event.preventDefault();
            if (chatMessage !== "")
            {
                sendmessagelocal()
            }
          }
        };
        document.addEventListener("keydown", listener);
        return () => {
          document.removeEventListener("keydown", listener);
        };
      }, [chatMessage]);

    const setChat = (newChat, newUser) => {
        let u6loc = u6
        let u5loc = u5
        let u4loc = u4
        let u3loc = u3
        let u2loc = u2
        let u1loc = u1
        let cm6loc = cm6
        let cm5loc = cm5
        let cm4loc = cm4
        let cm3loc = cm3
        let cm2loc = cm2
        let cm1loc = cm1
        setu7(u6loc)
        setu6(u5loc)
        setu5(u4loc)
        setu4(u3loc)
        setu3(u2loc)
        setu2(u1loc)
        setu1(newUser)
        setcm7(cm6loc)
        setcm6(cm5loc)
        setcm5(cm4loc)
        setcm4(cm3loc)
        setcm3(cm2loc)
        setcm2(cm1loc)
        setcm1(newChat)
    }

    const chatHandler = (event) => {
        setChatMessage(event.target.value);
    }

    const sendmessagelocal = () => {
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
                event: "chatSend",
                gameCode: props.gameCode,
                userName: props.username,
                uid: JSON.parse(localStorage.getItem("uid")),
                chatText: chatMessage
            })
        }
    } 

    if (cm1 !== "" && u1 !== "")
    {
        m1 = <div className = "messageDiv">{cm1}</div>
        u1t = <div className = "userNameDiv">{u1}{": "}</div>

        r1 = <div className = "lineWrapper">
                <div className = "userWrapper">
                    {u1t}
                </div>
                <div className = "messageWrapper1">
                    {m1}
                </div>
            </div>
    }
    if (cm2 !== "" && u2 !== "")
    {
        m2 = <div className = "messageDiv">{cm2}</div>
        u2t = <div className = "userNameDiv">{u2}{": "}</div>

        r2 = <div className = "lineWrapper">
                <div className = "userWrapper">
                    {u2t}
                </div>
                <div className = "messageWrapper1">
                    {m2}
                </div>
            </div>
    }
    if (cm3 !== "" && u3 !== "")
    {
        m3 = <div className = "messageDiv">{cm3}</div>
        u3t = <div className = "userNameDiv">{u3}{": "}</div>

        r3 = <div className = "lineWrapper">
                <div className = "userWrapper">
                    {u3t}
                </div>
                <div className = "messageWrapper1">
                    {m3}
                </div>
            </div>
    }
    if (cm4 !== "" && u4 !== "")
    {
        m4 = <div className = "messageDiv">{cm4}</div>
        u4t = <div className = "userNameDiv">{u4}{": "}</div>

        r4 = <div className = "lineWrapper">
                <div className = "userWrapper">
                    {u4t}
                </div>
                <div className = "messageWrapper1">
                    {m4}
                </div>
            </div>
    }
    if (cm5 !== "" && u5 !== "")
    {
        m5 = <div className = "messageDiv">{cm5}</div>
        u5t = <div className = "userNameDiv">{u5}{": "}</div>

        r5 = <div className = "lineWrapper">
                <div className = "userWrapper">
                    {u5t}
                </div>
                <div className = "messageWrapper1">
                    {m5}
                </div>
            </div>
    }
    if (cm6 !== "" && u6 !== "")
    {
        m6 = <div className = "messageDiv">{cm6}</div>
        u6t = <div className = "userNameDiv">{u6}{": "}</div>

        r6 = <div className = "lineWrapper">
                <div className = "userWrapper">
                    {u6t}
                </div>
                <div className = "messageWrapper1">
                    {m6}
                </div>
            </div>
    }
    if (cm7 !== "" && u7 !== "")
    {
        m7 = <div className = "messageDiv">{cm7}</div>
        u7t = <div className = "userNameDiv">{u7}{": "}</div>

        r7 = <div className = "lineWrapper">
                <div className = "userWrapper">
                    {u7t}
                </div>
                <div className = "messageWrapper1">
                    {m7}
                </div>
            </div>
    }
    chatBar = <form className="chatForm" id="chatform">
    <input
        type="text"
        className="inputChat"
        id="addInput"
        placeholder="chat..."
        onChange={chatHandler}
    />
    </form>

    sendButton = <div className="sendbutton" onClick = {() => sendmessagelocal()}><button style = {{fontFamily: 'arcadeclassic'}}>SEND</button></div>
        return (
            <div className = "chatBoxWrapper">
                {r7}
                {r6}
                {r5}
                {r4}
                {r3}
                {r2}
                {r1}
                {chatBar}
                {sendButton}
                </div>
        );

    };

export default ChatBox