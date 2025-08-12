import React, { useState, useEffect, useRef } from 'react';
import '../css/Login.css';
import Header from './header';
import Footer from './footer';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SERVER_API = process.env.REACT_SERVER_APP_API_URL;

function Login({ t, onLoginSuccess, setIsLoggedIn, setCurrentUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const loginBoxRef = useRef(null);

  // ✅ 사용자의 프로필 정보를 가져오는 함수
  const fetchUserProfile = async (token) => {
    try {
      const profileResponse = await fetch(`${SERVER_API}/api/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        localStorage.setItem('currentUser', JSON.stringify(profileData));
        setCurrentUser(profileData);
        return profileData; // 프로필 데이터 반환
      } else {
        console.error('Failed to fetch user profile.');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        return null;
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('authToken');
      setIsLoggedIn(false);
      return null;
    }
  };

  // ✅ 10분(600000ms)마다 프로필 정보를 업데이트하는 useEffect
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    let interval;

    if (token) {
      // 컴포넌트 마운트 시 최초 1회 즉시 조회
      fetchUserProfile(token);

      // 10분마다 프로필 정보 갱신
      interval = setInterval(() => {
        fetchUserProfile(token);
      }, 600000); // 10분 = 600,000ms
    }

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(interval);
  }, []); // 빈 배열은 컴포넌트가 처음 마운트될 때만 실행

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('authToken', data.token);

        // 로그인 성공 후 프로필 정보 즉시 가져오기
        await fetchUserProfile(data.token);

        onLoginSuccess();
        navigate('/');
      } else {
        setErrorMessage(data.message || '로그인 중 오류가 발생했습니다.');
      }
    } catch (err) {
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

  return (
      <>
        <Header />
        <div className="wrapper">
          <div
              ref={loginBoxRef}
              className="login-box"
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
        <Footer />
      </>
  );
}

export default Login;
