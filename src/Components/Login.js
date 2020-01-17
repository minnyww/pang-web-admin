import React, { useState } from 'react'
import 'antd/dist/antd.css';
import { Button, Input, message } from 'antd';
import styled from 'styled-components'
import firebaseApp from '../config/firebaseConfig';

const Container = styled.div`
    display : flex;
    justify-content : center;
    align-items : center;
    height : 100vh;
`

const Content = styled.div`
    width : 60%;
    height : 50%;
`

const Label = styled.label``

function Login() {

    const [inputUsername, setUsername] = useState('')
    const [inputPassword, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function handleLogin() {
        setIsLoading(true)
        if (inputUsername && inputPassword) {
            console.log(inputUsername)
            console.log(inputPassword)

            const userAdmin = await firebaseApp
                .firestore()
                .collection('admin-auth')
                .where("username", "==", inputUsername)
                .where("password", "==", inputPassword)
                .get();
            const users = await userAdmin.docs.map(doc => {
                const key = doc.key = doc.id;
                const data = doc.data();
                return { key, ...data };
            });
            console.log("users", users);
            if (users.length > 0) {
                users[0].isAuthen = true
                await firebaseApp.firestore().collection("admin-auth").doc(users[0].key).set(users[0])
                localStorage.setItem('user', JSON.stringify({ isLogin: true, name: users[0] }))
                window.location.reload()
            } else {
                message.warning("Username and password is wrong")
            }
            setIsLoading(false)

        } else {
            message.warning("Please Input your username and password")
        }
    }


    return (
        <Container>
            <Content>
                <Label>Enter Username : </Label>
                <Input placeholder="Enter your username" onChange={(event) => setUsername(event.target.value)} />
                <Label>Enter Password : </Label>
                <Input placeholder="Enter your password" type="password" onChange={(event) => setPassword(event.target.value)} />
                <Button
                    loading={isLoading}
                    onClick={() => handleLogin()}
                    type="primary"
                    style={{ marginTop: '2%', width: '100%' }}>Login</Button>
            </Content>
        </Container>
    )
}

export default Login