// header.js
import React, { useState, useEffect } from 'react';
import '../css/Header.css';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 로그인 상태 확인
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    // 사용자 데이터 가져오기
    const userDataStr = localStorage.getItem('currentUser');
    if (userDataStr) {
      setUserData(JSON.parse(userDataStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setUserData(null);
    navigate('/');
  };

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-flex">
            <div className="logo-section" onClick={() => navigate('/')}>
              <span className="logo-icon">📚</span>
              <h1 className="title">디지털 문해력 챌린지</h1>
            </div>
            <div className="user-info-header">
              <div className="info-box">
                <div className="info-label">내 점수</div>
                <div className="info-value">{userData ? userData.bestScore : '-'}</div>
              </div>
              <div className="info-box">
                <div className="info-label">랭킹</div>
                <div className="info-value">{userData ? '#23' : '-'}</div>
              </div>
              <div className="profile-section-header">
                {isLoggedIn ? (
                  <>
                    <Link to="/mypage" className="profile-icon login-status">👤</Link>
                  </>
                ) : (
                  <Link to="/login" className="profile-icon">👤</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
