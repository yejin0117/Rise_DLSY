// Ranking.js
import React, { useState, useEffect, useMemo } from 'react';
import '../css/Ranking.css';
import Header from './header';
import Footer from './footer';

const SERVER_API = process.env.REACT_APP_SERVER_API_URL;

function Ranking() {
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [rankingData, setRankingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const itemsPerPage = 10;

    // 숫자 안전 포맷터 (undefined/null 방지)
    const formatScore = (value) => {
        const n = Number(value);
        return Number.isFinite(n) ? n.toLocaleString() : '0';
    };

    useEffect(() => {
        const fetchRankingData = async () => {
            setLoading(true);
            setError(null);
            let url = '';

            if (selectedGrade === 'all') {
                url = `${SERVER_API}/api/users/ranking`;
            } else if (selectedGrade === 'bySchool') {
                url = `${SERVER_API}/api/users/ranking/school`;
            } else if (selectedGrade === 'high') {
                url = `${SERVER_API}/api/users/ranking/high`;
            } else if (selectedGrade === 'middle') {
                url = `${SERVER_API}/api/users/ranking/middle`;
            } else if (selectedGrade === 'elementary') {
                url = `${SERVER_API}/api/users/ranking/elementary`;
            }

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('랭킹 정보를 가져오는 데 실패했습니다.');
                }
                const data = await response.json();
                const safe = Array.isArray(data) ? data.filter(Boolean) : [];
                setRankingData(safe);
            } catch (err) {
                setError(err.message);
                setRankingData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRankingData();
    }, [selectedGrade]);

    const currentPageData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return rankingData.slice(startIndex, endIndex);
    }, [rankingData, currentPage]);

    const totalPages = Math.max(1, Math.ceil(rankingData.length / itemsPerPage));

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleGradeChange = (grade) => {
        setSelectedGrade(grade);
        setCurrentPage(1);
    };

    const getRankingClass = (rank) => {
        if (rank === 1) return 'first-rank';
        if (rank === 2) return 'second-rank';
        if (rank === 3) return 'third-rank';
        return '';
    };

    const gradeOptions = [
        { value: 'all', label: '전체' },
        { value: 'bySchool', label: '학교별' },
        { value: 'elementary', label: '초등학생' },
        { value: 'middle', label: '중학생' },
        { value: 'high', label: '고등학생' }
    ];

    const getGradeTitle = () => {
        const gradeMap = {
            'all': '전체',
            'bySchool': '학교별',
            'elementary': '초등학생',
            'middle': '중학생',
            'high': '고등학생'
        };
        return gradeMap[selectedGrade];
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>오류: {error}</div>;
    }

    return (
        <>
            <Header />
            <div className="ranking-page">
                <div className="ranking-container">
                    <h1 className="ranking-title">실시간 랭킹</h1>

                    <div className="ranking-filters">
                        <div className="filter-group">
                            {gradeOptions.map(option => (
                                <button
                                    key={option.value}
                                    className={`filter-button ${selectedGrade === option.value ? 'active' : ''}`}
                                    onClick={() => handleGradeChange(option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="ranking-list">
                        {currentPageData.map((item, index) => (
                            <div
                                key={index}
                                className={`ranking-item ${getRankingClass(item?.rank)}`}
                            >
                                <div className="rank-info">
                                    <span className="rank-number">{item?.emoji || item?.rank}</span>
                                    <div className="user-info">
                                        {selectedGrade === 'bySchool' ? (
                                            <>
                                                <div className="user-name">{item?.school || '-'}</div>
                                                <div className="user-school">
                                                    총점: {formatScore(item?.totalScore)}점
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="user-name">{item?.username || '-'}</div>
                                                <div className="user-school">
                                                    {(item?.school || '-')}{' '}{(item?.grade ?? '-') + '학년'}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="score-info">
                                    {selectedGrade === 'bySchool' ? (
                                        <div className="score-rank">
                                            {formatScore(item?.totalScore)}점
                                        </div>
                                    ) : (
                                        <div className="score-rank">
                                            {formatScore(item?.score)}점
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        <button
                            className="pagination-button"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                        >
                            이전
                        </button>
                        <span className="page-number">{currentPage} / {totalPages}</span>
                        <button
                            className="pagination-button"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            다음
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Ranking;
