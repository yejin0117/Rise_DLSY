import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MyPage.css';
import Header from './header';
import Footer from './footer';
import { loadBadges, BADGES } from '../utils/badgeManager';

function MyPage({setIsLoggedIn, setCurrentUser, currentUser}) {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        school: '',
        joinDate: '',
        totalGames: 0,
        bestScore: 0
    });
    const [badges, setBadges] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});

    useEffect(() => {
        // 사용자 데이터 로드
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
        const earnedBadges = loadBadges();
        console.log('Loaded badges:', earnedBadges); // 디버깅용 로그
        setBadges(earnedBadges);
    }, []);

    const getBadgeImage = (badge) => {
        // BADGES 객체에서 해당 뱃지 찾기
        const badgeDefinition = Object.values(BADGES).find(b => b.name === badge.name);
        console.log('Badge:', badge.name); // 디버깅용 로그
        console.log('Found definition:', badgeDefinition); // 디버깅용 로그
        // 정의된 뱃지가 있으면 그 이미지 사용, 없으면 저장된 이미지 경로 사용
        const image = badgeDefinition ? badgeDefinition.image : badge.image;
        console.log('Using image:', image); // 디버깅용 로그
        return image;
    };

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
                    {badges.map((badge, index) => {
                        const badgeImage = getBadgeImage(badge);
                        return (
                            <div
                                key={index}
                                className={`badge-box ${badge.active ? 'badge-active' : 'badge-inactive'}`}
                            >
                                <div className="badge-content">
                                    <div className="badge-image">
                                        <img src={badgeImage} alt={badge.name} />
                                    </div>
                                    <div className="badge-label">{badge.name}</div>
                                    <div className="badge-description">
                                        <p>{badge.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="actions-section">
                <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
            </div>
        </div>
        <Footer />
        </>
    );
}

export default MyPage;
