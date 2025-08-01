import React, { useState, useEffect, useRef } from 'react';
import '../css/Login.css';
import Header from './header';
import Footer from './footer';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// 더미 사용자 데이터
const DUMMY_USERS = [
  {
    id: 'test1',
    password: 'test123',
    username: '테스트유저1',
    email: 'test1@example.com',
    school:'안양고등학교',
    joinDate: '2024-07-01',
    totalGames: 15,
    bestScore: 95
  },
  {
    id: 'admin',
    password: 'admin123',
    username: '관리자',
    email: 'admin@example.com',
    school:'안양고등학교',
    joinDate: '2024-06-01',
    totalGames: 30,
    bestScore: 100
  }
];

function Login({ t, onLoginSuccess }) {
  const navigate = useNavigate();
  const [Id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const loginBoxRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (loginBoxRef.current) {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = scrollY / maxScroll;
        const oscillation = Math.sin(scrollPercentage * Math.PI * 2) * 20;
        setScrollPosition(oscillation);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!Id || !password) {
      setErrorMessage('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    // 더미 데이터에서 사용자 확인
    const user = DUMMY_USERS.find(user => user.id === Id && user.password === password);

    if (user) {
      // 로그인 성공
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));
      onLoginSuccess();
      navigate('/');
    } else {
      // 로그인 실패
      setErrorMessage('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
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
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <input
              type="text"
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
