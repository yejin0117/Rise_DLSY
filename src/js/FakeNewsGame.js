import React, { useState, useEffect } from 'react';
import '../css/FakeNewsGame.css';
import Header from './header';
import Footer from './footer';
import BadgeModal from '../components/BadgeModal/BadgeModal';
import { checkBadgeAchievement, saveBadges } from '../utils/badgeManager';

// TODO: API 연동 후 제거
const dummyNewsData = [
  {
    article: "t서울시는 내년부터 도시 전체 조명을 LED로 교체하는 사업을 시작한다. 이번 사업으로 전기 사용량이 30% 가량 절감될 것으로 예상된다. 시 관계자는 '5년에 걸쳐 단계적으로 진행할 예정'이라고 밝혔다.",
    isReal: true
  },
  {
    article: "f서울 도심에 인공 달 설치가 확정되었다. 지름 50m의 대형 반사판을 고도 500m에 설치하여 달빛보다 10배 밝은 조명을 제공할 예정이다. 이를 통해 야간 전기료를 90% 절감할 수 있을 것으로 기대된다.",
    isReal: false
  },
  {
    article: "t국내 연구진이 인공지능을 활용한 신약 후보물질 발굴 연구 성과를 발표했다. 기존 방식보다 개발 기간을 50% 단축할 수 있을 것으로 예상된다. 현재 전임상 실험이 진행 중이다.",
    isReal: true
  },
  {
    article: "f과학자들이 물만으로 움직이는 자동차 엔진 개발에 성공했다고 발표했다. 이 기술이 상용화되면 연료비가 거의 들지 않을 것으로 예상된다. 내년 중 첫 시제품이 출시될 예정이다.",
    isReal: false
  }
];

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

  useEffect(() => {
    // 임시 로직
    setNewsData(dummyNewsData);
    setLoading(false);
  }, []);

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
      const percentage = (finalScore / newsData.length) * 100;
      
      // 뱃지 확인
      const earnedBadges = checkBadgeAchievement('fakeNews', percentage);
      
      if (earnedBadges.length > 0) {
        saveBadges(earnedBadges);
        setEarnedBadge(earnedBadges[0]); // 가장 높은 등급의 뱃지 표시
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
