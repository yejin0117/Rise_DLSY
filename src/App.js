// src/App.js

import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './js/Main';
import Login from './js/Login';
import SignUp from './js/SignUp';
import Ranking from './js/Ranking';
import MyPage from './js/MyPage';
import NotFound from './pages/NotFound';
import NewsGame from './js/NewsGame';
import FakeNewsGame from './js/FakeNewsGame';
import Header from './js/header'; // Header import
import Footer from './js/footer'; // Footer import

const SERVER_API = process.env.REACT_APP_SERVER_API_URL;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = '#/';
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      handleLogout();
      return;
    }

    try {
      const response = await fetch(`${SERVER_API}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const userData = await response.json();
        setIsLoggedIn(true);
        setCurrentUser(userData);
        localStorage.setItem('isLoggedIn', 'true');
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      console.error("프로필 조회 실패:", error);
      handleLogout();
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      await fetchUserProfile();
      setLoading(false);
    };
    initializeApp();
  }, []);

  const handleLoginSuccess = async () => {
    await fetchUserProfile();
  };

  const t = {
    title: '로그인',
    Id: '아이디',
    email: '이메일',
    password: '비밀번호',
    login: '로그인',
    signup: '회원가입',
  };

  if (loading) {
    return <div className="loading-spinner"><div className="spinner"></div></div>;
  }

  return (
      <Router>
        {/* Header를 여기서 한 번만 렌더링하고 상태를 전달합니다. */}
        <Header isLoggedIn={isLoggedIn} currentUser={currentUser} />
        <main>
          <Routes>
            <Route
                path="/"
                element={<Main isLoggedIn={isLoggedIn} currentUser={currentUser} />}
            />
            <Route
                path="/login"
                element={<Login t={t} onLoginSuccess={handleLoginSuccess} />}
            />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route
                path="/mypage"
                element={<MyPage currentUser={currentUser} onLogout={handleLogout} />}
            />
            <Route path="/news-game" element={<NewsGame />} />
            <Route path="/fake-news-game" element={<FakeNewsGame />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {/* Footer도 여기서 한 번만 렌더링합니다. */}
        <Footer />
      </Router>
  );
}

export default App;