// src/js/header.js

import React from 'react';
import '../css/Header.css';
import { Link, useNavigate } from 'react-router-dom';

function Header({ isLoggedIn, currentUser }) {
  const navigate = useNavigate();

  const getRank = () => {
    if (!currentUser || !currentUser.ranking || !currentUser.profile) return '-';
    const userRanking = currentUser.ranking.find(rankItem => rankItem.username === currentUser.profile.username);
    return userRanking ? `#${userRanking.rank}` : '-';
  };

  return (
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
                <div className="info-value">
                  {currentUser && currentUser.profile ? (currentUser.profile.totalGames || 0) : '-'}
                </div>
              </div>
              <div className="info-box">
                <div className="info-label">랭킹</div>
                <div className="info-value">{getRank()}</div>
              </div>
              <div className="profile-section-header">
                {isLoggedIn ? (
                    <Link to="/mypage" className="profile-icon login-status">👤</Link>
                ) : (
                    <Link to="/login" className="profile-icon">👤</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
  );
}

export default Header;