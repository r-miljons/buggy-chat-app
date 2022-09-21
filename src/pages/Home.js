import React from 'react'
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat"

function Home() {
  return (
    <div className='home-container'>
      <div className='home-wrapper'>
        <Sidebar />
        <Chat />
      </div>
    </div>
  )
}

export default Home