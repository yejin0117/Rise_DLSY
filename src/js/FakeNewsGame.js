import React, { useState, useEffect } from 'react';
import '../css/FakeNewsGame.css';
import Header from './header';
import Footer from './footer';
import BadgeModal from '../components/BadgeModal/BadgeModal';

function FakeNewsGame() {
  const [questionData, setQuestionData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 문제 불러오기
  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/fake-news");
      const data = await res.json();
      setQuestionData(data);
    } catch (err) {
      console.error("문제 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (selectedIndex) => {
    try {
      const res = await fetch("/submit/api/fake-news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ selectedIndex })
      });

      const result = await res.json();

      const newAnswers = [
        ...answers,
        {
          question: questionData.options,
          selectedIndex,
          isCorrect: result.correct,
          correctIndex: questionData.answerIndex
        }
      ];
      setAnswers(newAnswers);
      if (result.correct) setScore(prev => prev + 1);

      setShowResult(true); // 단일 문제 기준
    } catch (err) {
      console.error("정답 제출 실패:", err);
    }
  };

  const resetGame = () => {
    setScore(0);
    setAnswers([]);
    setShowResult(false);
    fetchQuestion();
  };

  return (
    <>
      <Header />
      <div className="fake-news-game-container">
        <div className="game-content">
          <h1 className="game-title">가짜 뉴스 구별하기</h1>

          
          {loading ? (
            <p>문제를 불러오는 중입니다...</p>
          ) : !showResult ? (
            questionData && (
              <div className="news-card">
                <h2 className="news-title">아래 뉴스 중 진짜는 무엇일까요?</h2>
                {questionData.options.map((option, idx) => (
                  <div key={idx} className="news-option">
                    <p className="news-content">{option}</p>
                    <button
                      className="select-button"
                      onClick={() => handleAnswer(idx)}
                    >
                      선택하기
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="result-container">
              <h2 className="result-title">게임 결과</h2>
              <div className="score-container">
                <div className="final-score">
                  {score} / {answers.length}
                  <span className="score-label">정답</span>
                </div>
                <div className="score-percentage">
                  정확도: {Math.round((score / answers.length) * 100)}%
                </div>
              </div>

              <div className="detailed-results">
                {answers.map((answer, index) => (
                  <div
                    key={index}
                    className={`result-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}
                  >
                    <h3>선택한 뉴스</h3>
                    <p>{answer.question[answer.selectedIndex]}</p>
                    <p>
                      <strong>정답:</strong> {answer.question[answer.correctIndex]}
                    </p>
                    <p>
                      <strong>판별 결과:</strong> {answer.isCorrect ? "정답입니다!" : "오답입니다."}
                    </p>
                  </div>
                ))}
              </div>

              <button className="retry-button" onClick={resetGame}>
                다시 도전하기
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default FakeNewsGame;
