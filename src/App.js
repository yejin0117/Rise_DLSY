import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './js/Main';
import Login from './js/Login';
import SignUp from './js/SignUp';
import Ranking from './js/Ranking';
import MyPage from './js/MyPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 로그인 상태 확인
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const t = {
    title: '로그인',
    Id: '아이디',
    email: '이메일',
    password: '비밀번호',
    login: '로그인',
    signup: '회원가입',
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login t={t} onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
