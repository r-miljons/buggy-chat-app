import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatContext'
import add from '../assets/add.svg'
import more from '../assets/more.svg'
import Messages from './Messages'
import Input from './Input'

function Chat() {
  const { data } = useContext(ChatContext);

  return (
    <div className='chat'>
      <div className='chat-info'>
        <span>{data.user?.displayName}</span>
        <div className='chat-icons'>
          <img src={add} alt='add friend'/>
          <img src={more} alt='more options'/>  
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  )
}

export default Chat