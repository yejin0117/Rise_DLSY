import React, { useState, useEffect, useRef } from 'react';
import '../css/Login.css';
import Header from './header';
import Footer from './footer';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Login({ t, onLoginSuccess }) {
  const navigate = useNavigate();
  const [Id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const loginBoxRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (loginBoxRef.current) {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = scrollY / maxScroll;
        
        // Calculate oscillation with reduced amplitude (20px)
        const oscillation = Math.sin(scrollPercentage * Math.PI * 2) * 20;
        
        setScrollPosition(oscillation);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!Id || !password) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 로그인 처리 후 콜백 호출
    console.log('로그인 성공');
    onLoginSuccess(); // App에 알림
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <>
      <Header/>
      <div className="wrapper">
        <div 
          ref={loginBoxRef}
          className="login-box"
          style={{
            transform: `translate(-50%, calc(-50% + ${scrollPosition}px))`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <button type="button" className="close-button" onClick={handleBack}>
            <FaTimes />
          </button>
          <form onSubmit={handleLogin}>
            <h2>{t.title}</h2>
            <input
              type="Id"
              placeholder={t.Id}
              value={Id}
              onChange={(e) => setId(e.target.value)}
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
      <Footer/>
    </>
  );
}

export default Login;
