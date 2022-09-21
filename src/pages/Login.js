import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import LoadingSpinner from "../components/LoadingSpinner"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"

function Login() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
      setLoading(false);
      setError(false);
    } catch (e) {
      setError(true);
      setLoading(false);
      console.log(e);
    }
  }

  return (
    <div className='form-container'>
        <div className='form-wrapper'>
            <h1>Soy Chat</h1>
            <p>Login</p>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder='Email' onChange={(e) => setEmail(e.currentTarget.value)} required/>
                <input type="password" minLength={6} placeholder='Password' onChange={(e) => setPassword(e.currentTarget.value)} required/>
                <button style={{marginTop: "0.5rem"}}>{loading? <LoadingSpinner/> : "Login"}</button>
                {error && <p className='warning'>Something went wrong...</p>}
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    </div>
  )
}

export default Login