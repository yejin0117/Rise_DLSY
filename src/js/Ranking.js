import React, { useState, useMemo } from 'react';
import '../css/Ranking.css';
import Header from './header';
import Footer from './footer';

function Ranking() {
    const [selectedPeriod, setSelectedPeriod] = useState('daily');
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 개인 랭킹 데이터
    const individualRankings = [
        { rank: 1, emoji: '🥇', name: '김문해', school: '서울고등학교', grade: '고2', score: 2850, change: '+2', gradeType: 'high' },
        { rank: 2, emoji: '🥈', name: '이팩트', school: '부산중학교', grade: '중3', score: 2720, change: '-1', gradeType: 'middle' },
        { rank: 3, emoji: '🥉', name: '박뉴스', school: '대구고등학교', grade: '고1', score: 2650, change: '+1', gradeType: 'high' },
        { rank: 4, emoji: '4', name: '최미디어', school: '인천중학교', grade: '중2', score: 2500, change: '0', gradeType: 'middle' },
        { rank: 5, emoji: '5', name: '정리터', school: '광주고등학교', grade: '고3', score: 2480, change: '+3', gradeType: 'high' },
        { rank: 6, emoji: '6', name: '강판별', school: '대전중학교', grade: '중1', score: 2350, change: '-2', gradeType: 'middle' },
        { rank: 7, emoji: '7', name: '윤분석', school: '울산고등학교', grade: '고2', score: 2300, change: '+1', gradeType: 'high' },
        { rank: 8, emoji: '8', name: '조요약', school: '세종중학교', grade: '중3', score: 2250, change: '-1', gradeType: 'middle' },
        { rank: 9, emoji: '9', name: '한진실', school: '제주고등학교', grade: '고1', score: 2200, change: '+2', gradeType: 'high' },
        { rank: 10, emoji: '10', name: '배미디어', school: '강원중학교', grade: '중2', score: 2150, change: '-3', gradeType: 'middle' },
        // 초등학생 데이터 추가
        { rank: 11, emoji: '11', name: '김초등', school: '서울초등학교', grade: '초6', score: 2100, change: '0', gradeType: 'elementary' },
        { rank: 12, emoji: '12', name: '이초등', school: '부산초등학교', grade: '초5', score: 2050, change: '+1', gradeType: 'elementary' },
        { rank: 13, emoji: '13', name: '박초등', school: '대구초등학교', grade: '초6', score: 2000, change: '-1', gradeType: 'elementary' },
    ];

    // 학교별 랭킹 계산
    const schoolRankings = useMemo(() => {
        const schoolScores = {};
        const schoolStudents = {};

        // 현재 선택된 학년에 해당하는 학생들만 필터링
        const filteredStudents = selectedGrade === 'all' || selectedGrade === 'bySchool' 
            ? individualRankings 
            : individualRankings.filter(student => student.gradeType === selectedGrade);

        // 각 학교별 총점과 학생 수 계산
        filteredStudents.forEach(student => {
            if (!schoolScores[student.school]) {
                schoolScores[student.school] = 0;
                schoolStudents[student.school] = [];
            }
            schoolScores[student.school] += student.score;
            schoolStudents[student.school].push(student);
        });

        // 학교별 평균 점수 계산 및 정렬
        const schoolArray = Object.entries(schoolScores).map(([school, totalScore]) => ({
            school,
            totalScore,
            studentCount: schoolStudents[school].length,
            averageScore: Math.round(totalScore / schoolStudents[school].length),
            students: schoolStudents[school]
        }));

        // 총점 기준으로 정렬
        schoolArray.sort((a, b) => b.totalScore - a.totalScore);

        // 순위 부여
        return schoolArray.map((school, index) => ({
            ...school,
            rank: index + 1,
            emoji: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (index + 1).toString()
        }));
    }, [individualRankings, selectedGrade]);

    // 필터링된 랭킹 데이터
    const filteredRankings = useMemo(() => {
        if (selectedGrade === 'all') {
            return individualRankings;
        }
        if (selectedGrade === 'bySchool') {
            return schoolRankings;
        }
        
        // 학년별 필터링 및 순위 재계산
        const filtered = individualRankings
            .filter(student => student.gradeType === selectedGrade)
            .sort((a, b) => b.score - a.score)
            .map((student, index) => ({
                ...student,
                rank: index + 1,
                emoji: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (index + 1).toString()
            }));
        
        return filtered;
    }, [individualRankings, selectedGrade, schoolRankings]);

    const gradeOptions = [
        { value: 'all', label: '전체' },
        { value: 'bySchool', label: '학교별' },
        { value: 'elementary', label: '초등학생' },
        { value: 'middle', label: '중학생' },
        { value: 'high', label: '고등학생' }
    ];

    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredRankings.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(filteredRankings.length / itemsPerPage);

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

    const getRankingClass = (rank) => {
        if (rank === 1) return 'first-rank';
        if (rank === 2) return 'second-rank';
        if (rank === 3) return 'third-rank';
        return '';
    };

    const handleGradeChange = (grade) => {
        setSelectedGrade(grade);
        setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
    };

    // 학년별 타이틀 표시
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
                        {getCurrentPageData().map((item, index) => (
                            <div 
                                key={index} 
                                className={`ranking-item ${getRankingClass(item.rank)}`}
                            >
                                <div className="rank-info">
                                    <span className="rank-number">{item.emoji}</span>
                                    <div className="user-info">
                                        {selectedGrade === 'bySchool' ? (
                                            <>
                                                <div className="user-name">{item.school}</div>
                                                <div className="user-school">
                                                    총점: {item.totalScore.toLocaleString()}점 
                                                    (평균: {item.averageScore.toLocaleString()}점)
                                                </div>
                                                <div className="school-info">
                                                    참여 학생 수: {item.studentCount}명
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="user-name">{item.name}</div>
                                                <div className="user-school">
                                                    {item.school} {item.grade}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="score-info">
                                    {selectedGrade === 'bySchool' ? (
                                        <div className="score-rank">
                                            {item.averageScore.toLocaleString()}점
                                        </div>
                                    ) : (
                                        <div className="score-rank">
                                            {item.score.toLocaleString()}점
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
