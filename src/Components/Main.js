import React from 'react'
import 'antd/dist/antd.css';
import { } from 'antd';
import Login from './Login';
import styled from 'styled-components'
import Admin from './Admin';

const Container = styled.div``

const user = JSON.parse(window.localStorage.getItem("user"))
function Main() {
    return (
        <Container>

            {user && user.isLogin === true ?
                <Admin user={user} /> :
                <Login />
            }
        </Container>
    )
}


export default Main