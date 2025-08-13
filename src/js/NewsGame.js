// src/js/NewsGame.js
import React, { useState, useEffect, useRef } from 'react';
import '../css/NewsGame.css';
import Header from './header';
import Footer from './footer';
import BadgeModal from '../components/BadgeModal/BadgeModal';
import { useNavigate } from 'react-router-dom';
import { checkBadgeAchievement, saveBadges } from '../utils/badgeManager';

const SERVER_API = process.env.REACT_APP_SERVER_API_URL;

function NewsGame() {
  const navigate = useNavigate();
  const [news, setNews] = useState(null); // {id, title, content}
  const [userSummary, setUserSummary] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null); // AI 비교 결과
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // 제출 중 로딩 상태
  const [error, setError] = useState(null);

  // 뱃지 관련 상태
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      const fetchNews = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`${SERVER_API}/api/compare-random`);
          if (!response.ok) throw new Error('뉴스 불러오기 실패');
          const data = await response.json();
          setNews(data);
        } catch (error) {
          setError('뉴스를 불러오는 중 문제가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      };
      fetchNews();

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  // 요약 제출
  const handleSubmit = async () => {
    if (!userSummary.trim()) {
      alert('요약문을 입력해주세요.');
      return;
    }

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    setSubmitting(true); // 제출 로딩 시작

    try {
      const response = await fetch(`${SERVER_API}/api/compare-random/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          newsId: news.id,
          userSummary: userSummary,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '제출 실패');
      }

      setResult(data);

      // 게임 횟수 증가
      const currentCount = parseInt(localStorage.getItem('newsGameCount') || '0');
      localStorage.setItem('newsGameCount', (currentCount + 1).toString());

      // 뱃지 확인
      const earnedBadges = checkBadgeAchievement('news', data.score);
      
      if (earnedBadges.length > 0) {
        // 기존 뱃지 목록 가져오기
        const existingBadges = JSON.parse(localStorage.getItem('earnedBadges') || '[]');
        
        // 새로 획득한 뱃지만 필터링
        const newBadges = earnedBadges.filter(newBadge => 
          !existingBadges.some(existing => existing.name === newBadge.name)
        );
        
        if (newBadges.length > 0) {
          saveBadges(newBadges);
          setEarnedBadge(newBadges[0]); // 첫 번째 새 뱃지 표시
          setShowBadgeModal(true);
        }
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('제출 오류:', error);
      alert('제출 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false); // 제출 로딩 종료
    }
  };

  // 다시하기
  const handleReset = () => {
    window.location.reload();
  };

  if (loading) {
    return (
        <div className="news-game-container">
          <div className="game-content">
            <div className="loading-container-news">
              <div className="loading-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
              </div>
              <h2 className="loading-title">뉴스 한 줄 요약</h2>
              <p className="loading-text">뉴스 기사를 불러오는 중입니다...</p>
              <div className="loading-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <>
          <Header />
          <div className="news-game-container">
            <div className="game-content">
              <div className="error-message">{error}</div>
              <button className="retry-btn" onClick={handleReset}>다시 시도</button>
            </div>
          </div>
          <Footer />
        </>
    );
  }

  return (
      <>
        <div className="news-game-container">
          <div className="game-content">
            <h1 className="game-title">뉴스 한 줄 요약</h1>

            {/* 게임 설명 */}
            <div className="game-instructions">
              <h2>게임 방법</h2>
              <ul>
                <li>AI가 요약한 뉴스 기사를 읽고 핵심 내용을 한 줄로 요약해보세요.</li>
                <li>AI가 작성한 요약문과 비교하여 점수를 받게 됩니다.</li>
                <li>중요한 키워드를 포함하고, 간결하게 작성할수록 높은 점수를 받을 수 있습니다.</li>
              </ul>
            </div>

            {/* 뉴스 기사 */}
            {news && (
                <div className="news-article">
                  <h2>{news.title}</h2>
                  <p>{news.content}</p>

                  <div className="summary-input-section">
                    <h3>나의 한 줄 요약</h3>
                    <div className="input-container">
                  <textarea
                      value={userSummary}
                      onChange={(e) => setUserSummary(e.target.value)}
                      placeholder="뉴스의 핵심 내용을 한 줄로 요약해보세요."
                      disabled={isSubmitted || submitting}
                      maxLength={200}
                  />
                      <div className="char-count">{userSummary.length}/200</div>
                    </div>
                    {!isSubmitted && !submitting && (
                        <button className="submit-btn" onClick={handleSubmit}>
                          제출하기
                        </button>
                    )}
                    {submitting && (
                        <div className="submit-loading-container">
                          <div className="submit-loading-spinner">
                            <div className="spinner-ring"></div>
                            <div className="spinner-ring"></div>
                          </div>
                          <p className="submit-loading-text">AI가 요약을 분석하고 있습니다...</p>
                          <div className="loading-dots">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                          </div>
                        </div>
                    )}
                  </div>

                  {/* 결과 표시 */}
                  {isSubmitted && result && (
                      <div className="result-section">
                        <div className="score-display">
                          <h3>나의 점수</h3>
                          <div className="score">{result.score}점</div>
                        </div>
                        <div className="comparison">
                          <div className="summary-box-feedback">
                            <h4>AI 비교 결과</h4>
                            <p><strong>유사도:</strong> {result.similarity}</p>
                            <p><strong>차이점:</strong> {result.difference}</p>
                            <p><strong>제안:</strong> {result.suggestion}</p>
                          </div>
                          <div className="summary-box">
                            <h4>나의 요약</h4>
                            <p>{result.userSummary}</p>
                          </div>
                          <div className="summary-box">
                            <h4>AI의 한 줄 요약</h4>
                            <p>{result.aiSummary}</p>
                          </div>
                        </div>

                        <div className="button-container-news">
                          <button className="reset-btn" onClick={handleReset}>
                            다시하기
                          </button>
                          <button className="home-btn" onClick={() => window.location.href = '/'}>
                            홈으로
                          </button>
                        </div>
                      </div>
                  )}
                </div>
            )}
          </div>
        </div>
        <BadgeModal
            isOpen={showBadgeModal}
            onClose={() => setShowBadgeModal(false)}
            earnedBadge={earnedBadge}
        />
      </>
  );
}

export default NewsGame;
