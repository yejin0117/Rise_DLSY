import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Main.css';
import Header from './header';
import Footer from './footer';

const SERVER_API = process.env.REACT_APP_SERVER_API_URL;

function Main({isLoggedIn, setCurrentUser, currentUser}) {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch(`${SERVER_API}/api/users/ranking`);
        if (!response.ok) {
          throw new Error('랭킹 정보를 가져오는 데 실패했습니다.');
        }
        const data = await response.json();
        setRankings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  const handleStartGame = (gameType) => {
    if (gameType === 'summary') {
      navigate('/news-game');
    } else if (gameType === 'factcheck') {
      navigate('/fake-news-game');
    }
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'yellow';
    if (rank === 2) return 'gray';
    if (rank === 3) return 'orange';
    return null;
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  return (
      <>
        <Header/>
        <div className="body-bg">
          {/* Main Content */}
          <main className="container main-content">
            {/* Progress Section */}
            <section className="section-box">
              <h2 className="section-title">오늘의 진행상황</h2>
              <div className="progress-grid">
                {[
                  {
                    icon: '📰',
                    label: '뉴스 요약',
                    progress: 60,
                    current: 3,
                    max: 5,
                    color: 'blue',
                  },
                  {
                    icon: '🔍',
                    label: '가짜뉴스 구별',
                    progress: 33,
                    current: 1,
                    max: 3,
                    color: 'red',
                  },
                ].map((item, i) => (
                    <div key={i} className="progress-box">
                      <div className="progress-icon">{item.icon}</div>
                      <div className="progress-label">{item.label}</div>
                      <div className={`progress-value text-${item.color}`}>
                        {item.current} / {item.max}
                      </div>
                      <div className="progress-bar-bg">
                        <div
                            className={`progress-bar-fill bg-${item.color}`}
                            style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                ))}
              </div>
            </section>

            {/* Challenge Cards */}
            <h3 className="section-title games-title">문해력 게임</h3>
            <div className="card-grid">
              {[
                {
                  title: '뉴스 한 줄 요약',
                  desc: '뉴스 기사를 읽고 핵심 내용을 한 줄로 요약해보세요. AI와 비교하여 점수를 받습니다.',
                  score: '+100점',
                  color: 'blue',
                  onClick: () => handleStartGame('summary'),
                },

                {
                  title: '가짜뉴스 구별',
                  desc: '진짜 뉴스와 AI가 생성한 가짜 뉴스를 구별해보세요.',
                  score: '+100점',
                  color: 'red',
                  onClick: () => handleStartGame('factcheck'),
                },
              ].map((card, i) => (
                  <div key={i} className="challenge-card" onClick={card.onClick}>
                    <div className="card-header">
                      <h3>{card.title}</h3>
                      <span className={`score-tag score-${card.color}`}>{card.score}</span>
                    </div>
                    <p className="card-desc">{card.desc}</p>
                    <div className="card-footer">
                      <button className={`challenge-btn btn-${card.color}`}>도전하기 →</button>
                    </div>
                  </div>
              ))}
            </div>

            <div className="badges-rankings-container">


              {/* 실시간 랭킹 */}
              <section className="ranking-section card">
                <h3 className="section-title">실시간 랭킹</h3>
                <div className="ranking-list">
                  {rankings.map((r, i) => (
                      <div
                          key={i}
                          className={`ranking-item-main  ranking-bg-${getRankColor(r.rank)}`}
                      >
                        <div className="ranking-left">
                          <span className="ranking-emoji">{getRankEmoji(r.rank)}</span>
                          <div>
                            <div className="ranking-name">{r.username}</div>
                            <div className="ranking-school">{r.school}</div>
                          </div>
                        </div>
                        <div className="ranking-score">{r.score.toLocaleString()}점</div>
                      </div>
                  ))}
                  <div className="ranking-more-btn-container">
                    <button
                        className="ranking-more-btn"
                        onClick={() => navigate('/ranking')}
                    >
                      전체 랭킹 보기 →
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </main>
          <Footer/>
        </div>
      </>
  );
}

export default Main;
