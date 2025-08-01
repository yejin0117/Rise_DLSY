import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MyPage.css';
import Header from './header';
import Footer from './footer';

const MyPage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        joinDate: '',
        totalGames: 0,
        bestScore: 0
    });

    useEffect(() => {
        const userDataStr = localStorage.getItem('currentUser');
        if (userDataStr) {
            const user = JSON.parse(userDataStr);
            setUserData({
                username: user.username,
                email: user.email,
                school: user.school,
                joinDate: user.joinDate,
                totalGames: user.totalGames,
                bestScore: user.bestScore
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    return (
        <>
        <Header />
        <div className="mypage-container">
            <div className="mypage-header">
                <h1>마이 페이지</h1>
                <div className="header-buttons">
                    <button className="edit-profile-btn">프로필 수정</button>
                </div>
            </div>
            
            <div className="profile-section">
                <h2>프로필 정보</h2>
                <div className="profile-info">
                    <div className="info-item">
                        <label>사용자 이름:</label>
                        <span>{userData.username}</span>
                    </div>
                    <div className="info-item">
                        <label>이메일:</label>
                        <span>{userData.email}</span>
                    </div>
                    <div className="info-item">
                        <label>학교:</label>
                        <span>{userData.school}</span>
                    </div>
                    <div className="info-item">
                        <label>가입일:</label>
                        <span>{userData.joinDate}</span>
                    </div>
                </div>
            </div>

            <div className="stats-section">
                <h2>게임 통계</h2>
                <div className="stats-info">
                    <div className="stat-item">
                        <label>총 게임 수:</label>
                        <span>{userData.totalGames}</span>
                    </div>
                    <div className="stat-item">
                        <label>최고 점수:</label>
                        <span>{userData.bestScore}</span>
                    </div>
                </div>
            </div>

            <div className="actions-section">
                <button className="change-password-btn">비밀번호 변경</button>
                    <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default MyPage;
