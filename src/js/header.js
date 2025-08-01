// header.js
import React, { useState } from 'react';
import '../css/Header.css';
import { Link, useNavigate } from 'react-router-dom';

function Main() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

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
                <div className="info-value">1,250</div>
              </div>
              <div className="info-box">
                <div className="info-label">랭킹</div>
                <div className="info-value">#42</div>
              </div>
               <div className="profile-icon">
                  {isLoggedIn ? (
                    <span>👤</span>
                  ) : (
                    <Link to="/login">👤</Link>
                  )}
                </div>
            </div>
          </div>
        </div>
      </header>
      </>
  );
}

export default Main;
