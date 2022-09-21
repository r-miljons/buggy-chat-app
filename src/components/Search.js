import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs, getDoc, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"
import { AuthContext } from "../context/AuthContext"
import { useContext } from 'react';
import SmallSpinner from './LoadingSpinner';

function Search() {
  const [username, setUsername] = useState("");
  const [clientTyping, setClientTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [foundNothing, setFoundNothing] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(false);
  const { currentUser } = useContext(AuthContext);

  async function searchForUsers() {
    if (username.length > 0) {
      setLoading(true);
      // displayName starts with search phrase (username)
      const q = query(collection(db, "users"),
      where("displayName", ">=", username), 
      where('displayName', '<=', username + '\uf8ff'));

      try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setLoading(false);
          setFoundNothing(true);
        }
        querySnapshot.forEach((doc) => {
          const user = doc.data();
          setSearchResults(prev => [...prev, user]);
        });
        setLoading(false);
      } catch(e) {
        setError(true);
        setLoading(false);
        console.log(e);
      }

    }
  }

  // search only after no typing has been done in the last second
  useEffect(() => {
    if (!clientTyping) {
      return
    } else {
      const delay = setTimeout(() => {
        setClientTyping(false);
        searchForUsers();
      },1000);

      return () => {
        clearTimeout(delay);
      }
    }
  },[username]);

  function handleChange(e) {
    if (!clientTyping) {
      setClientTyping(true)
    }
    if (foundNothing) {
      setFoundNothing(false)
    }
    if (searchResults.length > 0) {
      setSearchResults([]);
    }
    setUsername(e.target.value)
  }

  async function handleSelect(user) {
    // check if the chat already exists, if not create a new one
    // use combined user id's to identify the chat
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    try {
      const resp = await getDoc(doc(db, "chats", combinedId))
      if (!resp.exists()) {
        // create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        // create a chat for each user
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedId + ".date"]: serverTimestamp()
        })
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [combinedId + ".date"]: serverTimestamp()
        })
      }
      setSearchResults([]);
      setUsername("");
    } catch (e) {
      console.log(e)
    }
    
  }

  return (
    <div className='search'>
      <div className='search-form'>
        <input type='text' placeholder='Find users' value={username} onChange={handleChange}/>
      </div>
        { clientTyping || loading ? <SmallSpinner style={{margin: '0 auto', display: 'block', height: "2rem"}}/> : false }
        { foundNothing || error ? <p style={{width: "100%", textAlign: 'center', marginTop: "1rem", color: "#fffa"}}>No results</p> : false }
        {
          searchResults.map((user, index) => {
            return <div className='user-chat' key={index} onClick={() => handleSelect(user)}>
              <img src={user.photoURL} alt='user-profile'/>
              <div className='user-chat-info'>
                  <span>{user.displayName}</span>
              </div>
            </div>
          })
        }
    </div>
  )
}

export default Search