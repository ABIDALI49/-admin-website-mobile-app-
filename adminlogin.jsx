import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/adminlogin.css'; 
import securityLogo from '../assets/images/security.png'; // Adjust the path as needed

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if(email =="abidadmin@gmail.com" && password=="QURESHI123"){
navigate('/dashboard');
      }
      else{
        alert("incooreect data")
      }
      // await signInWithEmailAndPassword(auth, email, password);
      // 
    } catch (error) {
      alert('Login Failed: ' + error.message);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-box">
        {/* Logo */}
        <img src={securityLogo} alt="Security Logo" className="admin-logo" />

        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
