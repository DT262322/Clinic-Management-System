import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/LoginRegister.css';

const AuthView = () => {
  const [activeView, setActiveView] = useState('login');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('/Users/login', { username: userName, password });
      const token = response.data.token;
      const parts=token.split('.');
      const payload=atob(parts[1]);
      const jsonPayload=JSON.parse(payload);
      const userId = jsonPayload.UserId;
      const username=jsonPayload.UserName;
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username);
      localStorage.setItem('userId',userId);
      console.log(userId,username)
      setIsLoggedIn(true);
      navigate('/'); // Điều hướng đến trang chính
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response && error.response.data) {
        alert(error.response.data); 
      } else {
        alert('Login failed! Please check your credentials.'); // Thông báo lỗi chung
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserName('');
    setPassword('');

    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('/Users/register', { username: userName, email, password });
      alert('Registration successful! Please login.');
      setActiveView('login'); // Chuyển về trang đăng nhập sau khi đăng ký
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response && error.response.data) {
        alert(error.response.data); // Hiển thị thông báo lỗi từ server
      } else {
        alert('Registration failed! Please try again.'); // Thông báo lỗi chung
      }
    }
  };

  if (isLoggedIn) {
    return (
      <div className="auth-container">
        <h2>Welcome, {localStorage.getItem('username')}!</h2>
        <Button label="Logout" onClick={handleLogout} className="p-button-danger" />
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-toggle">
        <Button
          label="Login"
          onClick={() => setActiveView('login')}
          className={activeView === 'login' ? 'p-button-primary' : 'p-button-outlined'}
        />
        <Button
          label="Register"
          onClick={() => setActiveView('register')}
          className={activeView === 'register' ? 'p-button-primary' : 'p-button-outlined'}
        />
      </div>

      {activeView === 'login' ? (
        <div className="login-container">
          <h2>Login</h2>
          <div className="p-field">
            <label htmlFor="userName">User Name</label>
            <InputText id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} />
          </div>
          <div className="p-field">
            <label htmlFor="password">Password</label>
            <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask />
          </div>
          <Button label="Login" onClick={handleLogin} className="p-button-success" />
        </div>
      ) : (
        <div className="register-container">
          <h2>Register</h2>
          <div className="p-field">
            <label htmlFor="userName">User Name</label>
            <InputText id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} />
          </div>
          <div className="p-field">
            <label htmlFor="email">Email</label>
            <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="p-field">
            <label htmlFor="password">Password</label>
            <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask />
          </div>
          <Button label="Register" onClick={handleRegister} className="p-button-success" />
        </div>
      )}
    </div>
  );
};

export default AuthView;
