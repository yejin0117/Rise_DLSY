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
import BadgeTest from './pages/BadgeTest';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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
        <Route path="/" element={
          <Main isLoggedIn={isLoggedIn} 
              setCurrentUser={setCurrentUser}
              currentUser={currentUser}/>} />
        <Route path="/login" element={
          <Login t={t} onLoginSuccess={handleLoginSuccess} 
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
              currentUser={currentUser}/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/ranking" element={<Ranking
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
              currentUser={currentUser}
            />}/>
        <Route path="/mypage" element={
            <MyPage
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
              currentUser={currentUser}
            />}/>
        <Route path="/news-game" element={<NewsGame
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
              currentUser={currentUser}
            />}/>
        <Route path="/fake-news-game" element={<FakeNewsGame
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
              currentUser={currentUser}
            />}/>
        <Route path="/badge-test" element={<BadgeTest
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
              currentUser={currentUser}
            />}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
