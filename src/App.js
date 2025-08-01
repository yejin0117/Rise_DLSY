import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './js/Main';
import Login from './js/Login';
import SignUp from './js/SignUp';
import Ranking from './js/Ranking';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => setIsLoggedIn(true);

  const t = {
    title: '로그인',
    Id: '아이디',
    password: '비밀번호',
    login: '로그인',
    signup: '회원가입',
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login t={t} onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/ranking" element={<Ranking />} />
      </Routes>
    </Router>
  );
}

export default App;
