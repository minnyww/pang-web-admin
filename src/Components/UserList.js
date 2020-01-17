import React from 'react'
import 'antd/dist/antd.css';
import { List, Avatar, } from 'antd';
import styled, { } from 'styled-components'

const UserContainer = styled.div`
    background : white;
    /* padding : 24px; */
    height: 80vh;
    overflow-y : auto;
`

function UserList({ data, setChatSelected, isLoading }) {
    return (
        <UserContainer>
            <h2>Total Students</h2>
            <List
                loading={isLoading}
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (
                    <List.Item
                        style={item.isSelected ?
                            { cursor: 'pointer', background: '#1890ff', padding: '10px' } :
                            { cursor: 'pointer', padding: '10px' }}
                        onClick={() => setChatSelected(item)}>
                        <List.Item.Meta
                            avatar={<Avatar src={item.picUrl} />}
                            title={<a style={item.isSelected ? { color: '#fff' } : {}} href="https://ant.design">{item.displayName}</a>}
                            description={<span style={item.isSelected ? { color: '#fff' } : {}}>{item.lineId}</span>}
                        />
                    </List.Item>
                )
                }
            />
        </UserContainer >
    )
}

export default UserList