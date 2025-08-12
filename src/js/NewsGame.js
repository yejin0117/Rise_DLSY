// src/js/NewsGame.js

import React, { useState, useEffect } from 'react';
import '../css/NewsGame.css';
import BadgeModal from '../components/BadgeModal/BadgeModal';
import { useNavigate } from 'react-router-dom';

const SERVER_API = process.env.REACT_APP_SERVER_API_URL;

function NewsGame() {
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [userSummary, setUserSummary] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);

  useEffect(() => {
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
  }, []);

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
        throw new Error(data.message || '제출 실패');
      }

      setResult(data);
      setIsSubmitted(true);

      const badge = checkEarnedBadge(data.score);
      if (badge) {
        setEarnedBadge(badge);
        setShowBadgeModal(true);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const checkEarnedBadge = (score) => {
    if (score >= 90) return { name: "뉴스 마스터", image: "/badges/summary-master.png", description: "뛰어난 요약 능력을 보여주셨습니다!" };
    if (score >= 75) return { name: "팩트체커", image: "/badges/key-point.png", description: "뉴스의 핵심을 잘 파악하셨습니다!" };
    return null;
  };

  const handleReset = () => {
    window.location.reload();
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
      <div className="news-game-container">
        <div className="game-content">
          <h1 className="game-title">뉴스 한 줄 요약</h1>
          <div className="game-instructions">
            <h2>게임 방법</h2>
            <ul>
              <li>주어진 뉴스 기사를 읽고 핵심 내용을 한 줄로 요약해보세요.</li>
              <li>AI가 작성한 요약문과 비교하여 점수를 받게 됩니다.</li>
              <li>중요한 키워드를 포함하고, 간결하게 작성할수록 높은 점수를 받을 수 있습니다.</li>
            </ul>
          </div>
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
                    disabled={isSubmitted}
                    maxLength={200}
                />
                    <div className="char-count">{userSummary.length}/200</div>
                  </div>
                  {!isSubmitted ? (
                      <button className="submit-btn" onClick={handleSubmit}>제출하기</button>
                  ) : (
                      <div className="button-container-news">
                        <button className="reset-btn" onClick={handleReset}>다시하기</button>
                        <button className="home-btn" onClick={() => navigate('/')}>홈으로</button>
                      </div>
                  )}
                </div>
                {isSubmitted && result && (
                    <div className="result-section">
                      <div className="score-display">
                        <h3>나의 점수</h3>
                        <div className="score">{result.score}점</div>
                      </div>
                      <div className="comparison">
                        <div className="summary-box-feedback">
                          <h4>AI의 피드백</h4>
                          <p>{result.feedback}</p>
                        </div>
                        <div className="summary-box">
                          <h4>나의 요약</h4>
                          <p>{result.userSummary}</p>
                        </div>
                        <div className="summary-box">
                          <h4>AI의 요약</h4>
                          <p>{result.aiSummary}</p>
                        </div>
                      </div>
                    </div>
                )}
              </div>
          )}
        </div>
        <BadgeModal isOpen={showBadgeModal} onClose={() => setShowBadgeModal(false)} earnedBadge={earnedBadge} />
      </div>
  );
}

export default NewsGame;