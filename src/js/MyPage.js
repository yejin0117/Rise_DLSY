import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MyPage.css';
import Header from './header';
import Footer from './footer';

const defaultBadges = [
    { 
        name: "진실 수호자",
        emoji: '🥇', 
        label: '진실 수호자', 
        description: "모든 가짜 뉴스를 완벽하게 구별했습니다!",
        gradient: 'yellow',
        active: false
    },
    { 
        name: "뉴스 마스터",
        emoji: '🔍', 
        label: '뉴스 마스터', 
        description: "뛰어난 판단력으로 가짜 뉴스를 구별했습니다!",
        gradient: 'blue',
        active: false
    },
    { 
        name: "요약의 달인",
        emoji: '⚖️', 
        label: '요약의 달인', 
        description: "뛰어난 요약 능력을 보여주셨습니다!",
        gradient: 'purple',
        active: false
    },
    { 
        name: "핵심 포착왕",
        emoji: '🎯', 
        label: '핵심 포착왕', 
        description: "뉴스의 핵심을 잘 파악하셨습니다!",
        gradient: 'green',
        active: false
    },
    {  name: "스피드런너", emoji: '🚀', label: '스피드런너', description: "뉴스의 핵심을 잘 파악하셨습니다!", gradient: null, active:false },
    {  name: "문해력왕", emoji: '👑', label: '문해력왕', description: "뉴스의 핵심을 잘 파악하셨습니다!", gradient: null, active:false },
];

const MyPage = ({setIsLoggedIn, setCurrentUser, currentUser}) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        school: '',
        joinDate: '',
        totalGames: 0,
        bestScore: 0
    });
    const [badges, setBadges] = useState(defaultBadges);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});

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
            setEditedData({
                username: user.username,
                email: user.email,
                school: user.school
            });
        }

        // 획득한 뱃지 로드
        const earnedBadges = JSON.parse(localStorage.getItem('earnedBadges') || '[]');
        const updatedBadges = defaultBadges.map(badge => ({
            ...badge,
            active: earnedBadges.some(earned => earned.name === badge.name)
        }));
        setBadges(updatedBadges);
    }, []);

    // 로그아웃 처리
    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedData({
            username: userData.username,
            email: userData.email,
            school: userData.school
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        // TODO: API 연동 후 수정
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const newUserData = { ...currentUser, ...editedData };
        localStorage.setItem('currentUser', JSON.stringify(newUserData));
        
        setUserData(prev => ({
            ...prev,
            ...editedData
        }));
        setIsEditing(false);
    };

    return (
        <>
        <Header />
        <div className="mypage-container">
            <div className="mypage-header">
                <h1>마이 페이지</h1>
            </div>
            
            <div className="profile-section">
                <div className="profile-header">
                    <h2>프로필 정보</h2>
                    {!isEditing && (
                        <button className="edit-profile-btn" onClick={handleEdit}>
                            프로필 수정
                        </button>
                    )}
                </div>
                <div className="profile-info">
                    <div className="info-item">
                        <label>사용자 이름:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="username"
                                value={editedData.username}
                                onChange={handleChange}
                                className="edit-input"
                            />
                        ) : (
                            <span>{userData.username}</span>
                        )}
                    </div>
                    <div className="info-item">
                        <label>이메일:</label>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={editedData.email}
                                onChange={handleChange}
                                className="edit-input"
                            />
                        ) : (
                            <span>{userData.email}</span>
                        )}
                    </div>
                    <div className="info-item">
                        <label>학교:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="school"
                                value={editedData.school}
                                onChange={handleChange}
                                className="edit-input"
                            />
                        ) : (
                            <span>{userData.school}</span>
                        )}
                    </div>
                    <div className="info-item">
                        <label>가입일:</label>
                        <span>{userData.joinDate}</span>
                    </div>
                </div>
                {isEditing && (
                    <div className="edit-buttons">
                        <button className="save-btn" onClick={handleSubmit}>저장</button>
                        <button className="cancel-btn" onClick={handleCancel}>취소</button>
                    </div>
                )}
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

            <div className="badge-section card">
                <h2>내 뱃지</h2>
                <div className="badge-grid">
                    {badges.map((b, i) => (
                    <div
                        key={i}
                        className={`badge-box ${b.active ? `badge-gradient-${b.gradient}` : 'badge-inactive'}`}
                    >
                        <div className="badge-emoji">{b.emoji}</div>
                        <div className="badge-label">{b.label}</div>
                        {b.active && <div className="badge-description">{b.description}</div>}
                    </div>
                    ))}
                </div>
            </div>

            <div className="actions-section">
                <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default MyPage;
