import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MyPage.css';
import Header from './header';
import Footer from './footer';
import SearchModal from './SearchModal';

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

const MyPage = ({ setIsLoggedIn, setCurrentUser, currentUser }) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        school: '',
        grade: '',
        location: '',
        joinDate: '',
        totalGames: 0,
        bestScore: 0
    });
    const [badges, setBadges] = useState(defaultBadges);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            // ✅ API 요청 주소 수정: 'api/users/profile'로 변경
            const response = await fetch('/api/users/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Fetched user data:', data);

                // ✅ 백엔드 응답 데이터 구조에 맞게 수정
                setUserData({
                    username: data.profile.username,
                    email: data.profile.email,
                    school: data.profile.school,
                    grade: data.profile.grade,
                    location: data.profile.location,
                    joinDate: data.profile.joinDate,
                    totalGames: data.profile.totalGames,
                    bestScore: data.profile.accuracy,
                });

                setEditedData({
                    username: data.profile.username,
                    email: data.profile.email,
                    school: data.profile.school,
                    grade: data.profile.grade,
                    location: data.profile.location
                });
            } else {
                const data = await response.json();
                setError(data.message || '프로필 정보를 가져오는 데 실패했습니다.');
                setIsLoggedIn(false);
                navigate('/login');
            }
        } catch (err) {
            console.error('프로필 조회 오류:', err);
            setError('서버 연결 중 오류가 발생했습니다.');
            setIsLoggedIn(false);
            navigate('/login');
        }
    };

    useEffect(() => {
        fetchUserProfile();

        const earnedBadges = JSON.parse(localStorage.getItem('earnedBadges') || '[]');
        const updatedBadges = defaultBadges.map(badge => ({
            ...badge,
            active: earnedBadges.some(earned => earned.name === badge.name)
        }));
        setBadges(updatedBadges);
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const handleEdit = () => {
        setIsEditing(true);
        setSuccessMessage('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedData({
            username: userData.username,
            email: userData.email,
            school: userData.school,
            grade: userData.grade,
            location: userData.location
        });
        setSuccessMessage('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('로그인이 필요합니다.');
            return;
        }

        try {
            // ✅ API 요청 주소 수정: 'api/users/profile'로 변경
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message);
                setIsEditing(false);
                fetchUserProfile();
            } else {
                setError(data.message || '프로필 업데이트 중 오류가 발생했습니다.');
            }
        } catch (err) {
            console.error('프로필 업데이트 오류:', err);
            setError('서버 연결 중 오류가 발생했습니다.');
        }
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
                    {error && <div className="error-message">{error}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}
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
                            <span>{userData.email}</span>
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
                            <label>학년:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="grade"
                                    value={editedData.grade}
                                    onChange={handleChange}
                                    className="edit-input"
                                />
                            ) : (
                                <span>{userData.grade}</span>
                            )}
                        </div>
                        <div className="info-item">
                            <label>지역:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="location"
                                    value={editedData.location}
                                    onChange={handleChange}
                                    className="edit-input"
                                />
                            ) : (
                                <span>{userData.location}</span>
                            )}
                        </div>
                        <div className="info-item">
                            <label>가입일:</label>
                            <span>{new Date(userData.joinDate).toLocaleDateString()}</span>
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
