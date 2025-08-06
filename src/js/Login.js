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
    email: 'test1@test.com',
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
  const [email, setEmail] = useState('');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    // 백엔드 친구들을 위한 API 호출
      try{
        // API 호출 로직 구현
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('isLoggedIn', 'true');

          //user 정보도 함께 받는 경우
          if(data.user){
            localStorage.setItem('currentUser', JSON.stringify(data.user));
          }
          localStorage.setItem('authToken', data.token); // ← 있으면 저장

          onLoginSuccess();
          navigate('/');
        } else {
          setErrorMessage(data.message || '로그인 중 오류가 발생했습니다.');
        }
      }catch (err) {
        console.error('로그인 오류:', err);
        setErrorMessage('서버 연결 중 오류가 발생했습니다.');
      }
    };

  const handleBack = () => {
    navigate('/');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  // DB가 없어 슬픈 프론트를 위한 더미데이터 사용 로그인
  /*
    // 더미 데이터로 로그인 처리 (개발 완료 후 삭제)
  const handleDummyLogin = () => {
    const user = DUMMY_USERS.find(
      user => user.email === email && user.password === password
    );

    if (user) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('authToken', 'dummy-token');
      onLoginSuccess();
      navigate('/');
      return true;
    }
    return false;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    // 더미 데이터로 로그인 시도 (개발 완료 후 이 부분 삭제)
    if (USE_DUMMY_DATA && handleDummyLogin()) {
      return;
    }

    try {
      // API 호출 로직
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        if (data.user) {
          localStorage.setItem('currentUser', JSON.stringify(data.user));
        }
        localStorage.setItem('authToken', data.token);
        onLoginSuccess();
        navigate('/');
      } else {
        setErrorMessage(data.message || '로그인 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      if (USE_DUMMY_DATA) {
        setErrorMessage('이메일 또는 비밀번호가 일치하지 않습니다.');
      } else {
        setErrorMessage('서버 연결 중 오류가 발생했습니다.');
      }
    }
  };
    */

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
      <Footer/>
    </>
  );
}

export default Login;
