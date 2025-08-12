// src/js/Login.js

import React, { useState } from 'react';
import '../css/Login.css';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SERVER_API = process.env.REACT_APP_SERVER_API_URL;

function Login({ t, onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`${SERVER_API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('jwtToken', data.token);
        if (onLoginSuccess) onLoginSuccess();
        navigate('/');
      } else {
        setErrorMessage(data.message || '로그인 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setErrorMessage('서버 연결 중 오류가 발생했습니다.');
    }
  };

  const handleBack = () => navigate('/');
  const handleSignUp = () => navigate('/signup');

  return (
      <div className="wrapper">
        <div className="login-box">
          <button type="button" className="close-button" onClick={handleBack}>
            <FaTimes />
          </button>
          <form onSubmit={handleLogin}>
            <h2>{t.title}</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <input
                type="text"
                placeholder={t.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <div className="password-container">
              <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
              <button
                  type="button"
                  className="eye-button"
                  onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <button type="submit" className="primary-button">{t.login}</button>
            <button type="button" className="secondary-button" onClick={handleSignUp}>
              {t.signup}
            </button>
          </form>
        </div>
      </div>
  );
}

export default Login;