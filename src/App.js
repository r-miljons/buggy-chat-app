import Register from "./pages/Register";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import "./style.css";

function App() {
  const { currentUser } = useContext(AuthContext);
  
  //redirect to login page if user is not logged in
  const ProtectedRoute = ({children}) => {
    if (!currentUser) {
      return <Navigate to="/"/>
    }
    return children
  }

  //redirect to home page if user logged in
  const RedirectRoute = ({children}) => {
    if (currentUser) {
      return <Navigate to="/home"/>
    }
    return children
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={
          <RedirectRoute>
            <Login />
          </RedirectRoute>
          } />
        <Route path="/register" element={
          <RedirectRoute>
            <Register />
          </RedirectRoute>
        } />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
