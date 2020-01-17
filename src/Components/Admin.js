import React, { useState, useEffect, } from 'react'
import 'antd/dist/antd.css';
import { Col, Row, Empty, Button, Card, } from 'antd';
import styled, { } from 'styled-components'
import firebaseApp from '../config/firebaseConfig';
import UserList from './UserList';
// import Chat from './Chat';

const Chat = React.lazy(() => import('./Chat'))

const ContentBody = styled.div`
    padding : 24px;
`

const TitleContent = styled.div`
    text-align : center;
`

const Title = styled.h2`

`

const ChatContainer = styled.div`
    background : white;
    /* padding : 24px; */
    height: 80vh;
    overflow-y : auto;
`

function Admin({ user }) {
    const [userList, setUserList] = useState([])
    const [chatSelected, setChatSelected] = useState()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getChatData()
        console.log('render')
    }, [])

    async function getUserData() {
        const usersData = await firebaseApp.firestore().collection("users-chat").get()
        const users = await usersData.docs.map(doc => {
            const data = doc.data();
            const key = doc.id;
            return { key, ...data };
        })
        return users
    }

    async function getChatData() {
        setIsLoading(true)
        const users = await getUserData()
        setUserList(users)
        setIsLoading(false)
    }


    function handleChatSelected(chat) {
        chat.isSelected = true
        userList.map(user => {
            if (user.lineId !== chat.lineId) {
                return user.isSelected = false
            } else {
                return user.isSelected = true
            }
        })
        setChatSelected({ ...chat })
    }

    return (
        <>
            <ContentBody >
                <TitleContent>
                    <Title>Welcome {user.name.name} <Button type="danger" size="small">Logout</Button></Title>
                </TitleContent>
                <Row gutter={16}>
                    <Col span={10}>
                        <Card bordered={false} hoverable style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)" }}>
                            <UserList data={userList} setChatSelected={handleChatSelected} isLoading={isLoading} />
                        </Card>
                    </Col>
                    <Col span={14}>
                        <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)" }}>
                            <ChatContainer>
                                <Title>Chat With : {chatSelected && chatSelected.displayName}</Title>
                                <React.Suspense fallback={<p>Loading...</p>}>
                                    {chatSelected && <Chat chatMessage={chatSelected} setChatSelected={setChatSelected} />}
                                </React.Suspense>
                                {!chatSelected && <Empty />}
                            </ChatContainer>
                        </Card>
                    </Col>
                </Row>
            </ContentBody>
        </>
    )
}

export default Admin