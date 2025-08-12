import React, { useState, useEffect } from 'react';
import '../css/FakeNewsGame.css';
import Header from './header';
import Footer from './footer';
import BadgeModal from '../components/BadgeModal/BadgeModal';

const SERVER_API = process.env.REACT_APP_SERVER_API_URL;

function FakeNewsGame() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 뉴스 기사 불러오기
  useEffect(() => {
    const fetchNewsArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${SERVER_API}/api/fake-news`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
    
        if (!response.ok) throw new Error('뉴스 기사 로딩 실패');
    
        const data = await response.json();
        setNewsData(data);
        setError(null);
      } catch (error) {
        console.error('뉴스 기사 로딩 중 오류:', error);
        setError('뉴스 기사를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewsArticles();
  }, []);

  // 뱃지 체크 함수 엔드포인트 수정필요
  const checkEarnedBadge = async (score, totalQuestions) => {
    // try {
    //   const response = await fetch(`${SERVER_API}/api/check-badge`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${localStorage.getItem('token')}`
    //     },
    //     body: JSON.stringify({
    //       gameType: 'fake-news',
    //       score,
    //       totalQuestions,
    //       userId: localStorage.getItem('userId')
    //     })
    //   });
    //   
    //   if (!response.ok) throw new Error('뱃지 확인 실패');
    //   const badge = await response.json();
    //   return badge;  // { name, image, description }
    // } catch (error) {
    //   console.error('뱃지 확인 중 오류:', error);
    //   return null;
    // }

    // 임시 로직
    const percentage = (score / totalQuestions) * 100;
    if (percentage === 100) {
      return {
        name: "공정한 눈",
        image: "/badges/truth-guardian.png",
        description: "모든 가짜 뉴스를 완벽하게 구별했습니다!"
      };
    } else if (percentage >= 75) {
      return {
        name: "정확도왕",
        image: "/badges/news-detective.png",
        description: "뛰어난 판단력으로 가짜 뉴스를 구별했습니다!"
      };
    }
    return null;
  };

  // 답변 제출 함수
  const submitAnswer = async (isRealSelected, currentQuestion) => {
    try {
      const response = await fetch(`${SERVER_API}/api/fake-news/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          newsId: currentQuestion.id,
          userAnswer: isRealSelected,
          userId: localStorage.getItem('userId'),
          //timeSpent: calculateTimeSpent() // 답변 시간 측정 함수 필요
        })
      });
    
      if (!response.ok) throw new Error('답변 제출 실패');
      const result = await response.json();
      return result.isCorrect;
    } catch (error) {
      console.error('답변 제출 중 오류:', error);
      return null;
    }

    // 임시 로직
    return isRealSelected === currentQuestion.isReal;
  };

  const handleAnswer = async (isRealSelected) => {
    const currentQuestion = newsData[currentQuestionIndex];
    const isCorrect = isRealSelected === currentQuestion.isReal;
    
    const newAnswers = [
      ...answers,
      {
        article: currentQuestion.article,
        selectedAnswer: isRealSelected ? "진짜" : "가짜",
        correctAnswer: currentQuestion.isReal ? "진짜" : "가짜",
        isCorrect
      }
    ];
    
    setAnswers(newAnswers);
    if (isCorrect) setScore(prev => prev + 1);

    if (currentQuestionIndex === newsData.length - 1) {
      const finalScore = isCorrect ? score + 1 : score;
      const badge = checkEarnedBadge(finalScore, newsData.length);
      
      if (badge) {
        // 기존 뱃지 불러오기
        const earnedBadges = JSON.parse(localStorage.getItem('earnedBadges') || '[]');
        
        // 중복 체크 후 새 뱃지 추가
        if (!earnedBadges.some(b => b.name === badge.name)) {
          earnedBadges.push({
            ...badge,
            active: true,
            gradient: badge.name === "진실 수호자" ? "yellow" : "blue"
          });
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

  const resetGame = () => {
    setScore(0);
    setAnswers([]);
    setShowResult(false);
    setCurrentQuestionIndex(0);
    setShowBadgeModal(false);
    setEarnedBadge(null);
    setError(null);
  };

  if (loading) return <div className="loading">뉴스를 불러오는 중입니다...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!newsData) return <div className="error">뉴스를 불러올 수 없습니다.</div>;

  return (
    <>
      <Header />
      <div className="fake-news-game-container">
        <div className="game-content-fake">
          <h1 className="game-title-fake">가짜 뉴스 판별하기</h1>
          
          {!showResult ? (
            <div className="news-card-fake">
              <p className="question-counter">
                문제 {currentQuestionIndex + 1} / {newsData.length}
              </p>
              <div className="news-article-fake">
                <h2>이 뉴스는 진짜일까요, 가짜일까요?</h2>
                <p className="article-content-fake">
                  {newsData[currentQuestionIndex].article}
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
      
      <Footer />
    </>
  );
}

export default FakeNewsGame;
