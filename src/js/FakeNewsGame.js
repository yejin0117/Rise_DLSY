import React, { useState, useEffect, useRef } from 'react'; // useRef를 import 합니다.
import '../css/FakeNewsGame.css';
import BadgeModal from '../components/BadgeModal/BadgeModal';

const SERVER_API = process.env.REACT_APP_SERVER_API_URL;

function FakeNewsGame() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // StrictMode에서 중복 실행을 방지하기 위한 ref를 추가합니다.
  const effectRan = useRef(false);

  // 뉴스 기사 불러오기 로직 수정
  useEffect(() => {
    // ref를 확인하여 effect가 한 번만 실행되도록 합니다.
    if (effectRan.current === false) {
      const fetchNewsArticles = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('jwtToken');

          const response = await fetch(`${SERVER_API}/api/fake-news`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '뉴스 기사 로딩 실패');
          }

          const data = await response.json();
          setNewsData(data);
          setError(null);
        } catch (error) {
          console.error('뉴스 기사 로딩 중 오류:', error);
          setError('뉴스 기사를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
          setLoading(false);
        }
      };

      fetchNewsArticles();

      // effect가 실행되었음을 표시하는 cleanup 함수를 반환합니다.
      return () => {
        effectRan.current = true;
      };
    }
  }, []); // 의존성 배열은 비워둡니다.

  // 뱃지 체크 함수
  const checkEarnedBadge = (finalScore, totalQuestions) => {
    const percentage = (finalScore / totalQuestions) * 100;
    if (percentage === 100) {
      return { name: "공정한 눈", image: "/badges/truth-guardian.png", description: "모든 가짜 뉴스를 완벽하게 구별했습니다!" };
    }
    if (percentage >= 75) {
      return { name: "정확도왕", image: "/badges/news-detective.png", description: "뛰어난 판단력으로 가짜 뉴스를 구별했습니다!" };
    }
    return null;
  };

  // 답변 처리 로직
  const handleAnswer = async (isRealSelected) => {
    const currentQuestion = newsData[currentQuestionIndex];
    const token = localStorage.getItem('jwtToken');

    let isCorrect = false;
    let truthIsFake = false;

    try {
      const response = await fetch(`${SERVER_API}/api/fake-news/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          questionToken: currentQuestion.questionToken,
          userAnswerIsFake: !isRealSelected
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '답변 제출에 실패했습니다.');
      }

      const result = await response.json();
      isCorrect = result.correct;
      truthIsFake = result.truthIsFake;

    } catch (err) {
      console.error("답변 제출 오류:", err);
      alert(err.message);
      return;
    }

    const newAnswers = [
      ...answers,
      {
        article: currentQuestion.article,
        selectedAnswer: isRealSelected ? "진짜" : "가짜",
        correctAnswer: truthIsFake ? "가짜" : "진짜",
        isCorrect
      }
    ];

    setAnswers(newAnswers);
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentQuestionIndex === newsData.length - 1) {
      // 게임이 완료되었을 때만 카운트 증가
      const currentCount = parseInt(localStorage.getItem('fakeNewsGameCount') || '0');
      localStorage.setItem('fakeNewsGameCount', (currentCount + 1).toString());
      
      const finalScore = isCorrect ? score + 1 : score;
      const badge = checkEarnedBadge(finalScore, newsData.length);

      if (badge) {
        const earnedBadges = JSON.parse(localStorage.getItem('earnedBadges') || '[]');
        if (!earnedBadges.some(b => b.name === badge.name)) {
          // BUG FIX: '진실 수호자' -> '공정한 눈'으로 수정하여 뱃지 이름과 일치시킴
          earnedBadges.push({ ...badge, active: true, gradient: badge.name === "공정한 눈" ? "yellow" : "blue" });
          localStorage.setItem('earnedBadges', JSON.stringify(earnedBadges));
        }
        setEarnedBadge(badge);
        setShowBadgeModal(true);
      }
      setShowResult(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // 게임 재시작 함수
  const resetGame = () => {
    window.location.reload();
  };

  if (loading) return <div className="loading">뉴스를 불러오는 중입니다...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
      <>
        <div className="fake-news-game-container">
          <div className="game-content-fake">
            <h1 className="game-title-fake">가짜 뉴스 판별하기</h1>

            {!showResult ? (
                newsData.length > 0 ? (
                    <div className="news-card-fake">
                      <p className="question-counter">
                        문제 {currentQuestionIndex + 1} / {newsData.length}
                      </p>
                      <div className="news-article-fake">
                        <h2>이 뉴스는 진짜일까요, 가짜일까요?</h2>
                        <p className="article-content-fake">
                          {newsData[currentQuestionIndex]?.article}
                        </p>
                      </div>
                      <div className="button-container-fake">
                        <button
                            className="real-button"
                            onClick={() => handleAnswer(true)}
                        >
                          진짜뉴스
                        </button>
                        <button
                            className="fake-button"
                            onClick={() => handleAnswer(false)}
                        >
                          가짜뉴스
                        </button>
                      </div>
                    </div>
                ) : (
                    <div className="error">불러올 뉴스가 없습니다.</div>
                )
            ) : (
                <div className="result-container">
                  <h2 className="result-title">게임 결과</h2>
                  <div className="score-container">
                    <div className="final-score">
                      {score} / {newsData.length}
                      <span className="score-label">정답</span>
                    </div>
                    <div className="score-percentage">
                      정확도: {Math.round((score / newsData.length) * 100)}%
                    </div>
                  </div>

                  <div className="detailed-results">
                    {answers.map((answer, index) => (
                        <div
                            key={index}
                            className={`result-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}
                        >
                          <h3>문제 {index + 1}</h3>
                          <p className="article-content-fake">{answer.article}</p>
                          <p><strong>당신의 판단:</strong> {answer.selectedAnswer}</p>
                          <p><strong>정답:</strong> {answer.correctAnswer}</p>
                          <p>
                            <strong>판별 결과:</strong> {answer.isCorrect ? "정답입니다!" : "오답입니다."}
                          </p>
                        </div>
                    ))}
                  </div>

                  <div className="button-container-fake">
                    <button className="retry-button" onClick={resetGame}>
                      다시하기
                    </button>
                    <button className="home-button-fake" onClick={() => window.location.href = '/'}>
                      홈으로
                    </button>
                  </div>
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

export default FakeNewsGame;