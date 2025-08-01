import React, { useState } from 'react';
import '../css/Ranking.css';
import Header from './header';
import Footer from './footer';

function Ranking() {
    const [selectedPeriod, setSelectedPeriod] = useState('daily'); // daily, weekly, monthly
    const [selectedGrade, setSelectedGrade] = useState('all'); // all, middle, high

    // 랭킹 데이터 (실제 구현시에는 API에서 받아올 데이터)
    const rankings = [
        { rank: 1, emoji: '🥇', name: '김문해', school: '서울고등학교', grade: '고2', score: 2850, change: '+2' },
        { rank: 2, emoji: '🥈', name: '이팩트', school: '부산중학교', grade: '중3', score: 2720, change: '-1' },
        { rank: 3, emoji: '🥉', name: '박뉴스', school: '대구고등학교', grade: '고1', score: 2650, change: '+1' },
        { rank: 4, emoji: '4', name: '최미디어', school: '인천중학교', grade: '중2', score: 2500, change: '0' },
        { rank: 5, emoji: '5', name: '정리터', school: '광주고등학교', grade: '고3', score: 2480, change: '+3' },
        { rank: 6, emoji: '6', name: '강판별', school: '대전중학교', grade: '중1', score: 2350, change: '-2' },
        { rank: 7, emoji: '7', name: '윤분석', school: '울산고등학교', grade: '고2', score: 2300, change: '+1' },
        { rank: 8, emoji: '8', name: '조요약', school: '세종중학교', grade: '중3', score: 2250, change: '-1' },
        { rank: 9, emoji: '9', name: '한진실', school: '제주고등학교', grade: '고1', score: 2200, change: '+2' },
        { rank: 10, emoji: '10', name: '배미디어', school: '강원중학교', grade: '중2', score: 2150, change: '-3' },
    ];

    // 기간별 필터 옵션
    const periodOptions = [
        { value: 'daily', label: '일간' },
        { value: 'weekly', label: '주간' },
        { value: 'monthly', label: '월간' }
    ];

    // 학년별 필터 옵션
    const gradeOptions = [
        { value: 'all', label: '전체' },
        { value: 'middle', label: '중학생' },
        { value: 'high', label: '고등학생' }
    ];

    // 순위 변동 스타일 결정
    const getChangeStyle = (change) => {
        const num = parseInt(change);
        if (num > 0) return 'change-up';
        if (num < 0) return 'change-down';
        return 'change-same';
    };

    return (
        <>
            <Header />
            <div className="ranking-page">
                <div className="ranking-container">
                    <h1 className="ranking-title">실시간 랭킹</h1>
                    
                    {/* 필터 섹션 */}
                    <div className="ranking-filters">
                        <div className="filter-group">
                            {periodOptions.map(option => (
                                <button
                                    key={option.value}
                                    className={`filter-button ${selectedPeriod === option.value ? 'active' : ''}`}
                                    onClick={() => setSelectedPeriod(option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        <div className="filter-group">
                            {gradeOptions.map(option => (
                                <button
                                    key={option.value}
                                    className={`filter-button ${selectedGrade === option.value ? 'active' : ''}`}
                                    onClick={() => setSelectedGrade(option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 랭킹 리스트 */}
                    <div className="ranking-list">
                        {rankings.map((item, index) => (
                            <div key={index} className="ranking-item">
                                <div className="rank-info">
                                    <span className="rank-number">{item.emoji}</span>
                                    <div className="user-info">
                                        <div className="user-name">{item.name}</div>
                                        <div className="user-school">
                                            {item.school} {item.grade}
                                        </div>
                                    </div>
                                </div>
                                <div className="score-info">
                                    <div className="score">{item.score.toLocaleString()}점</div>
                                    <div className={`rank-change ${getChangeStyle(item.change)}`}>
                                        {item.change}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 페이지네이션 (옵션) */}
                    <div className="pagination">
                        <button className="pagination-button">이전</button>
                        <span className="page-number">1</span>
                        <button className="pagination-button">다음</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Ranking;
