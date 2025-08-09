import React, { useState, useEffect } from 'react';
import '../css/NewsGame.css';
import Header from './header';
import Footer from './footer';

// 더미 뉴스 데이터
const dummyNews = [
  {
    id: 1,
    title: "인공지능 활용한 기후변화 예측 시스템 개발",
    content: "한국과학기술연구원(KIST)은 인공지능을 활용해 기후변화를 더 정확하게 예측할 수 있는 새로운 시스템을 개발했다고 발표했다. 이 시스템은 기존 예측 모델의 정확도를 30% 이상 향상시켰으며, 특히 극단적 기후 현상을 예측하는 데 탁월한 성능을 보였다. 연구팀은 전 세계 기상 데이터와 위성 관측 자료를 AI로 분석하여 이러한 성과를 달성했다고 밝혔다.",
    aiSummary: "KIST가 개발한 AI 기반 기후변화 예측 시스템이 기존 대비 30% 향상된 정확도를 보임",
    keywords: ["인공지능", "기후변화", "예측", "KIST", "정확도"]
  },
  {
    id: 2,
    title: "신규 친환경 전기차 배터리 기술 개발 성공",
    content: "국내 연구진이 기존 리튬이온 배터리보다 수명은 2배, 충전 속도는 3배 빠른 새로운 친환경 배터리 기술 개발에 성공했다. 이 기술은 희귀 금속 사용량을 90% 줄이면서도 성능은 향상시켜 주목받고 있다. 연구팀은 이 기술이 상용화되면 전기차 가격을 현재보다 30% 이상 낮출 수 있을 것으로 전망했다.",
    aiSummary: "국내 연구진이 수명 2배, 충전 3배 빠른 친환경 전기차 배터리 기술을 개발해 원가 절감 기대",
    keywords: ["전기차", "배터리", "친환경", "충전", "원가절감"]
  },
  {
    id: 3,
    title: "메타버스 활용한 새로운 교육 플랫폼 출시",
    content: "교육부는 메타버스 기술을 활용한 새로운 교육 플랫폼 '메타에듀'를 다음 달부터 전국 초중고교에 순차적으로 도입한다고 발표했다. 이 플랫폼은 학생들이 가상현실 속에서 역사 현장을 체험하거나 과학 실험을 할 수 있게 해준다. 시범 운영 결과 학생들의 수업 참여도와 이해도가 크게 향상된 것으로 나타났다.",
    aiSummary: "교육부가 전국 초중고교에 도입 예정인 메타버스 교육 플랫폼으로 학습 효과 향상 기대",
    keywords: ["메타버스", "교육", "가상현실", "학습효과", "플랫폼"]
  }
];

function NewsGame() {
  const [news, setNews] = useState(null);
  const [userSummary, setUserSummary] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // 더미 뉴스 불러오기
  const fetchNews = () => {
    const randomIndex = Math.floor(Math.random() * dummyNews.length);
    setNews(dummyNews[randomIndex]);
  };

  // 요약 평가 함수
  const evaluateSummary = (userSummary, newsData) => {
    let score = 0;
    let feedback = "";

    // 키워드 포함 여부 확인
    const keywordCount = newsData.keywords.filter(keyword => 
      userSummary.toLowerCase().includes(keyword.toLowerCase())
    ).length;

    // 길이 적절성 확인 (20~50자 이내가 적당)
    const lengthScore = userSummary.length >= 20 && userSummary.length <= 50 ? 20 : 10;

    // 점수 계산
    score = (keywordCount / newsData.keywords.length) * 80 + lengthScore;
    score = Math.round(score);

    // 피드백 생성
    if (score >= 90) {
      feedback = "훌륭한 요약입니다! 핵심 키워드를 잘 포함했습니다.";
    } else if (score >= 70) {
      feedback = "좋은 요약입니다. 조금 더 핵심 키워드를 포함해보세요.";
    } else if (score >= 50) {
      feedback = "무난한 요약입니다. 더 많은 핵심 내용을 담아보세요.";
    } else {
      feedback = "다시 한번 뉴스의 핵심 내용을 파악해보세요.";
    }

    return { score, feedback };
  };

  // 요약 제출 처리
  const handleSubmit = () => {
    if (!userSummary.trim()) {
      alert('요약문을 입력해주세요.');
      return;
    }

    const evaluation = evaluateSummary(userSummary, news);
    setResult({
      score: evaluation.score,
      feedback: evaluation.feedback,
      userSummary: userSummary,
      aiSummary: news.aiSummary
    });
    setIsSubmitted(true);
  };

  // 다시하기
  const handleReset = () => {
    setUserSummary('');
    setIsSubmitted(false);
    setResult(null);
    fetchNews();
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
      <Footer />
    </>
  );
}

export default NewsGame;
