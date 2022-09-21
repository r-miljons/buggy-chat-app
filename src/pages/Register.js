import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { auth, storage, db } from "../firebase";
import LoadingSpinner from "../components/LoadingSpinner";
import add from "../assets/profile.jpg";

function Register() {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [username, setUsername] = useState(null);
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);
	const [passwordsMatch, setPasswordsMatch] = useState(true);
	const [profilePicture, setProfilePicture] = useState(null);
	const navigate = useNavigate();

	function checkPassword(string) {
		if (password === string) {
			setPasswordsMatch(true);
		} else {
			setPasswordsMatch(false);
		}
	}

	function displayAvatar(e) {
		setProfilePicture(URL.createObjectURL(e.target.files[0]));
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!passwordsMatch) return;
		setLoading(true);

		// extract image file from sign up form
		const file = e.target[4].files[0];

		try {
			// create a new user, returns user object
			const response = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			// upload photo when successfully created a new user
			//create a unique image name
			const date = new Date().getTime();
			const storageRef = ref(storage, `${username + date}`);

			await uploadBytesResumable(storageRef, file).then(() => {
				getDownloadURL(storageRef).then(async (downloadURL) => {
					// Update the user to include the profile picture and username
					try {
						await updateProfile(response.user, {
							displayName: username,
							photoURL: downloadURL,
						});
						// save user to database
						await setDoc(doc(db, "users", response.user.uid), {
							uid: response.user.uid,
							displayName: username,
							email,
							photoURL: downloadURL,
						});
						// create an empty userChats collection to later populate when user has chats
						await setDoc(doc(db, "userChats", response.user.uid), {});
						// take to home screen when everything succeeds
						navigate("/home");
					} catch (e) {
						setLoading(false);
						setError(false);
						console.log(e);
					}
				});
			});
		} catch (e) {
			setError(true);
			setLoading(false);
			console.log(e);
		}
	}

	return (
		<div className="form-container">
			<div className="form-wrapper">
				<h1>Soy Chat</h1>
				<p>Register</p>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder="Username"
						onChange={(e) => setUsername(e.currentTarget.value)}
						required
					/>
					<input
						type="email"
						placeholder="Email"
						onChange={(e) => setEmail(e.currentTarget.value)}
						required
					/>
					<input
						type="password"
						minLength={6}
						placeholder="Password"
						onChange={(e) => setPassword(e.currentTarget.value)}
						required
					/>
					<input
						type="password"
						minLength={6}
						placeholder="Confirm Password"
						onChange={(e) => checkPassword(e.currentTarget.value)}
						required
					/>
					{!passwordsMatch && (
						<p className="warning">Passwords do not match!</p>
					)}
					<input
						type="file"
						id="add"
						accept="image/*"
						style={{ display: "none" }}
						onChange={displayAvatar}
						required
					/>
					<label htmlFor="add" className="label-flex">
						<img src={profilePicture ? profilePicture : add} alt="avatar" />
						<p>Choose profile picture</p>
					</label>
					<button>{loading ? <LoadingSpinner /> : "Sign Up"}</button>
					{error && <p className="warning">Something went wrong...</p>}
				</form>
				<p>
					Already have an account? <Link to="/">Login</Link>
				</p>
			</div>
		</div>
	);
}

export default Register;
