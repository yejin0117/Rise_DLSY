import React, { useState, useEffect } from 'react';
import '../css/NewsGame.css';
import Header from './header';
import Footer from './footer';
import BadgeModal from '../components/BadgeModal/BadgeModal';
import { useNavigate } from 'react-router-dom';

const SERVER_API = process.env.REACT_APP_SERVER_API_URL;

function NewsGame() {
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [userSummary, setUserSummary] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 뱃지 체크 함수 추가
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

  // ✅ POST: 요약 제출
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

    if (!response.ok) throw new Error('제출 실패');

    const data = await response.json();
    setResult(data);

    // 게임 횟수 증가 (로컬스토리지에 저장)
    const currentCount = parseInt(localStorage.getItem('newsGameCount') || '0');
    localStorage.setItem('newsGameCount', (currentCount + 1).toString());

    // 뱃지 체크
    const badge = checkEarnedBadge(data.score);
    if (badge) {
      setEarnedBadge(badge);
      setShowBadgeModal(true);
    }

    setIsSubmitted(true);
  } catch (error) {
    console.error('제출 오류:', error);
    alert('제출 중 오류가 발생했습니다.');
  }
};

  // 다시하기
  const handleReset = () => {
      window.location.reload();
  }

  const checkEarnedBadge = (score) => {
    // 뱃지 조건 설정
    if (score >= 80) {
      return {
        name: "뉴스 마스터",
        image: "/badges/summary-master.png",
        description: "뛰어난 요약 능력을 보여주셨습니다!"
      };
    } else if (score >= 75) {
      return {
        name: "팩트체커",
        image: "/badges/key-point.png",
        description: "뉴스의 핵심을 잘 파악하셨습니다!"
      };
    }
    return null;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="news-game-container">
          <div className="game-content">
            <div className="loading-message">뉴스를 불러오는 중입니다...</div>
          </div>
        </div>
        <Footer />
      </>
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
              <li>주어진 뉴스 기사를 읽고 핵심 내용을 한 줄로 요약해보세요.</li>
              <li>AI가 작성한 요약문과 비교하여 점수를 받게 됩니다.</li>
              <li>중요한 키워드를 포함하고, 간결하게 작성할수록 높은 점수를 받을 수 있습니다.</li>
            </ul>
          </div>

          {/* 뉴스 기사 */}
          {news ? (
            <div className="news-article">
              <h2>{news.title}</h2>
              <p>{news.content}</p>

              {/* 요약 입력 */}
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
                  <button className="submit-btn" onClick={handleSubmit}>
                    제출하기
                  </button>
                ) : (
                  <div className="button-container-news">
                  <button className="reset-btn" onClick={handleReset}>
                    다시하기
                  </button>
                  <button className="home-btn" onClick={() => window.location.href = '/'}>
                    홈으로
                  </button>
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
          ) : (
            <p>뉴스를 불러오는 중입니다...</p>
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
