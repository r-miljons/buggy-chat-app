import React, { useContext, useEffect, useState } from 'react'
import file from '../assets/attach.svg'
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function Input() {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          // error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );

    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        })
      })
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text
      },
      [data.chatId + ".date"]: serverTimestamp()
    })
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text
      },
      [data.chatId + ".date"]: serverTimestamp()
    })

    setText("");
    setImg(null);
  }

  useEffect(() => {
    const enterSend = (e) => {
      if (e.code === "Enter") {
        handleSend();
      }
    }
    window.addEventListener("keydown", enterSend);

    return () => {
      window.removeEventListener("keydown", enterSend);
    }
  },[])


  return (
    <div className='message-input'>
      <input type="text" placeholder='Type something...' value={text} onChange={e => setText(e.target.value)}/>
      <div className='message-icons'>
        <label htmlFor='file'>
          <img src={file} alt="attach file" />
        </label>
        <input type="file" id="file" style={{display: 'none'}} onChange={e => setImg(e.target.files[0])}/>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Input