import React, { useState } from 'react'
import { Empty, Input, Button, Icon, message } from 'antd';
import styled, { css } from 'styled-components'
import firebaseApp from '../config/firebaseConfig';
import Axios from 'axios'

const Message = styled.div`
    margin: 0.5rem;
    height: 3.5rem;
    padding: 10px;
    width: 70%;
    color: white;
    border-radius: 10px;

    ${props => props.message.from === "admin" && css`
        background: #1375d0;
        color: white;
        float : right;
    `}

    ${props => props.message.from === "user" && css`
        background: #5765a8;
        color: white;
        float : left;
    `}
`

const AnwserBox = styled.div`
    display : flex;
`

const ChatList = styled.div`
        background: #f6f6f6;
    padding: 20px;
    height: 80%;
    margin-bottom: 2%;
    overflow: auto;
`

const Image = styled.img`
    border-radius : 10px;
    margin: 1%;
    width: 51%;

    ${props => props.message.from === "admin" && css`
        float : right;
    `}
`

const UploadContainer = styled.label`
     /* border: 1px solid #ccc; */
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
`

async function sendMessageToUser(message, url, chatMessage) {
    const response = await Axios.post("https://cors-anywhere.herokuapp.com/https://9e853cf5.ngrok.io/sendMessageToUser", {
        messageText: message,
        imgUrl: url,
        chatMessage: chatMessage
    })
    return response.data
}

function Chat({ chatMessage, setChatSelected }) {
    const [inputMessage, setMessage] = useState('')

    async function getUserChatData() {
        const usersData = await firebaseApp.firestore().collection("users-chat").doc(`${chatMessage.lineId}`).get()
        setChatSelected({ ...usersData.data() })
        setMessage("")
    }

    async function handleSendMessage() {
        if (inputMessage) {
            const res = await sendMessageToUser(inputMessage, "", chatMessage)
            console.log(res)
            if (res === "update db and send push message success") {
                await getUserChatData()
            }

        } else {
            message.warning("Plesae Input message")
        }

    }

    async function handleUploadFile(event) {
        const file = event.target.files[0]
        if (file) {
            const storageRef = firebaseApp.storage().ref()
            await storageRef.child(`uploadImageForChat/${file.name}`).put(file)
            const starsRef = await storageRef.child(`uploadImageForChat/${file.name}`)
            const url = await starsRef.getDownloadURL()
            console.log(url)

            const res = await sendMessageToUser("", url, chatMessage)
            console.log(res)
            if (res === "update db and send push message success") {
                await getUserChatData()
            }
        }
    }

    return (
        <>
            <ChatList >
                {chatMessage.chatmessage.length > 0 ? chatMessage.chatmessage.map((message, index) => (
                    <div key={index}>
                        {message.imgUrl &&
                            <>
                                <Image
                                    message={message}
                                    src={message.imgUrl} alt="chat" />
                            </>
                        }
                        {!message.imgUrl &&
                            <Message message={message} >
                                <span>{message.message}</span><br />
                                <small>{message.timeStamp}</small>
                            </Message>
                        }
                    </div>
                )) : <Empty />}
            </ChatList>
            <AnwserBox>
                <Input.TextArea
                    style={{ marginRight: '2%' }}
                    autoSize
                    value={inputMessage}
                    placeholder="Enter your anwser"
                    onChange={(event) => setMessage(event.target.value)} />
                <Button
                    onClick={() => handleSendMessage()}
                    size="large"
                    style={{ height: 'auto' }}
                    type="primary"
                    icon="arrow-right">Send</Button>
                {/* <Icon type="file-image"  /> */}
            </AnwserBox>
            <UploadContainer>
                <Input type="file" onChange={(event) => handleUploadFile(event)} style={{ display: 'none' }} />
                <Icon type="cloud-upload" /> Upload Image
            </UploadContainer>

        </>

    )
}

export default Chat