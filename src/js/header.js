import React, { useState, useEffect } from 'react';
import '../css/Header.css';
import { Link, useNavigate } from 'react-router-dom';

const SERVER_API = process.env.REACT_APP_SERVER_API_URL;

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // ✅ 사용자 프로필 정보를 가져오는 함수
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
        setUserData(profileData);
        setIsLoggedIn(true);
      } else {
        console.error('Failed to fetch user profile.');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('authToken');
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const token = localStorage.getItem('authToken');

    if (loggedIn && token) {
      // 컴포넌트 마운트 시 프로필 정보 가져오기
      fetchUserProfile(token);
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUserData(null);
    navigate('/');
  };

  const getRank = () => {
    if (!userData || !userData.ranking) return '-';

    // 현재 로그인한 사용자의 랭킹 찾기
    const userRanking = userData.ranking.find(rankItem => rankItem.username === userData.profile.username);
    return userRanking ? `#${userRanking.rank}` : '-';
  };

  return (
      <>
        {/* Header */}
        <header className="header">
          <div className="container-header">
            <div className="header-flex">
              <div className="logo-section" onClick={() => navigate('/')}>
                <span className="logo-icon">NewsLit</span>
                <h1 className="title-header">디지털 문해력 챌린지</h1>
              </div>
              <div className="user-info-header">
                <div className="info-box">
                  <div className="info-label">내 점수</div>
                  <div className="info-value">{userData && userData.profile ? userData.profile.totalGames : '-'}</div>
                </div>
                <div className="info-box">
                  <div className="info-label">랭킹</div>
                  <div className="info-value">{getRank()}</div>
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