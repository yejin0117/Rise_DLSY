import React, { useState, useEffect } from 'react';
import '../css/NewsGame.css';
import Header from './header';
import Footer from './footer';

function NewsGame() {
  const [news, setNews] = useState(null);
  const [userSummary, setUserSummary] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // ✅ GET: 뉴스 불러오기
  const fetchNews = async () => {
    try {
      const response = await fetch('/api/compare-random');
      if (!response.ok) throw new Error('뉴스 불러오기 실패');

      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('뉴스 로딩 오류:', error);
    }
  };

  // ✅ POST: 요약 제출
  const handleSubmit = async () => {
    if (!userSummary.trim()) {
      alert('요약문을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/compare-random/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newsId: news.id,
          userSummary: userSummary,
        }),
      });

      if (!response.ok) throw new Error('제출 실패');

      const data = await response.json();
      setResult(data);
      setIsSubmitted(true);
    } catch (error) {
      console.error('제출 오류:', error);
      alert('제출 중 오류가 발생했습니다.');
    }
  };

  // ✅ 다시하기
  const handleReset = () => {
    setUserSummary('');
    setIsSubmitted(false);
    setResult(null);
    fetchNews(); // 새 뉴스 다시 불러오기
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <>
      <Header />
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
                    maxLength={100}
                  />
                  <div className="char-count">{userSummary.length}/100</div>
                </div>
                {!isSubmitted ? (
                  <button className="submit-btn" onClick={handleSubmit}>
                    제출하기
                  </button>
                ) : (
                  <button className="reset-btn" onClick={handleReset}>
                    다시하기
                  </button>
                )}
              </div>

              {/* 결과 표시 */}
              {isSubmitted && result && (
                <div className="result-section">
                  <div className="score-display">
                    <h3>나의 점수</h3>
                    <div className="score">{result.score}점</div>
                    <p className="feedback">{result.feedback}</p>
                  </div>

                  <div className="comparison">
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
      <Footer />
    </>
  );
}

export default NewsGame;
