import React, { useContext, useEffect, useRef } from 'react'
import guy from '../assets/guy.jpg'
import defaultProfile from '../assets/beans.jpg'
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';

function Message({message}) {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({behavior: 'smooth'});
  }, [message])
  

  return (
      <div ref={ref} className={message.senderId === currentUser.uid ? "message message-owner" : "message"}>
        <div className="message-info">
          <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL } alt='profile picture'/>
          <span>Just now</span>
        </div>
        <div className={message.senderId === currentUser.uid ? "message-text text-owner" : "message-text"}>
          <p>{message.text}</p>
          <div className='img-wrap'>
            {message.img && <img src={message.img} alt='attached image'/>}
          </div>
        </div>
      </div>
  )
}

export default Message