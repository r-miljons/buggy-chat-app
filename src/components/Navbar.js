import React, { useContext } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { currentUser } = useContext(AuthContext);
  
  return (
    <nav className='navbar'>
      <div className='user'>
        <img src={currentUser.photoURL} alt='profile picture'/>
        <span>{currentUser.displayName}</span>
      </div>
      <button onClick={() => signOut(auth)}>Logout</button>
    </nav>
  )
}

export default Navbar