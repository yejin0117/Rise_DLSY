// src/js/MyPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MyPage.css';
import { loadBadges, BADGES } from '../utils/badgeManager';

const SERVER_API = process.env.REACT_APP_SERVER_API_URL;

const MyPage = ({ currentUser, onLogout }) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [badges, setBadges] = useState([]); //

    useEffect(() => {
        if (currentUser && currentUser.profile) {
            setEditedData({
                username: currentUser.profile.username,
                school: currentUser.profile.school,
                grade: currentUser.profile.grade,
                location: currentUser.profile.location
            });
        } else {
            navigate('/login');
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
        if (onLogout) onLogout();
    };

    const handleEdit = () => {
        setIsEditing(true);
        setSuccessMessage('');
        setError('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (currentUser && currentUser.profile) {
            setEditedData({
                username: currentUser.profile.username,
                school: currentUser.profile.school,
                grade: currentUser.profile.grade,
                location: currentUser.profile.location
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setError('로그인이 필요합니다.');
            return;
        }
        try {
            const response = await fetch(`${SERVER_API}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedData),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccessMessage(data.message || "프로필이 성공적으로 업데이트되었습니다.");
                setIsEditing(false);
                window.location.reload();
            } else {
                setError(data.message || '프로필 업데이트 중 오류가 발생했습니다.');
            }
        } catch (err) {
            setError('서버 연결 중 오류가 발생했습니다.');
        }
    };

    if (!currentUser || !currentUser.profile) {
        return <div>프로필 정보를 불러오는 중...</div>;
    }

    const { profile } = currentUser;

    return (
        <div className="mypage-container">
            <div className="mypage-header"><h1>마이 페이지</h1></div>
            <div className="profile-section">
                <div className="profile-header">
                    <h2>프로필 정보</h2>
                    {!isEditing && <button className="edit-profile-btn" onClick={handleEdit}>프로필 수정</button>}
                </div>
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <div className="profile-info">
                    <div className="info-item">
                        <label>이름:</label>
                        {isEditing ? <input type="text" name="username" value={editedData.username || ''} onChange={handleChange} className="edit-input" /> : <span>{profile.username}</span>}
                    </div>
                    <div className="info-item"><label>이메일:</label><span>{profile.email}</span></div>
                    <div className="info-item">
                        <label>학교:</label>
                        {isEditing ? <input type="text" name="school" value={editedData.school || ''} onChange={handleChange} className="edit-input" /> : <span>{profile.school}</span>}
                    </div>
                    <div className="info-item">
                        <label>학년:</label>
                        {isEditing ? <input type="text" name="grade" value={editedData.grade || ''} onChange={handleChange} className="edit-input" /> : <span>{profile.grade}</span>}
                    </div>
                    <div className="info-item">
                        <label>지역:</label>
                        {isEditing ? <input type="text" name="location" value={editedData.location || ''} onChange={handleChange} className="edit-input" /> : <span>{profile.location}</span>}
                    </div>
                    <div className="info-item"><label>가입일:</label><span>{new Date(profile.joinDate).toLocaleDateString()}</span></div>
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
                    <div className="stat-item"><label>총 점수:</label><span>{profile.totalGames || 0}</span></div>
                    <div className="stat-item"><label>평균 점수:</label><span>{Number(profile.accuracy || 0).toFixed(2)}</span></div>
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
    );
};

export default MyPage;