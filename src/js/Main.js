// Main.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Main.css';
import Header from './header';
import Footer from './footer';

function Main() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const badges = [
    { emoji: '🥇', label: '뉴스 마스터', gradient: 'yellow' , active:true},
    { emoji: '🔍', label: '팩트체커', gradient: 'blue', active:true },
    { emoji: '⚖️', label: '공정한 눈', gradient: 'purple', active:true },
    { emoji: '🎯', label: '정확도왕', gradient: null, active:false },
    { emoji: '🚀', label: '스피드런너', gradient: null, active:false },
    { emoji: '👑', label: '문해력왕', gradient: null, active:false },
  ];

  const rankings = [
    { rankEmoji: '🥇', name: '김문해', school: '서울고등학교', score: 2850, color: 'yellow' },
    { rankEmoji: '🥈', name: '이팩트', school: '부산중학교', score: 2720, color: 'gray' },
    { rankEmoji: '🥉', name: '박뉴스', school: '대구고등학교', score: 2650, color: 'orange' },
  ];

  const handleStartGame = (gameType) => {
    if (gameType === 'summary') {
      navigate('/news-game');
    } else if (gameType === 'factcheck') {
      navigate('/fake-news-game');
    }
  };

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
                color: 'blue',
              },
              {
                icon: '🔍',
                label: '가짜뉴스 구별',
                progress: 33,
                current: 1,
                color: 'red',
              },
            ].map((item, i) => (
              <div key={i} className="progress-box">
                <div className="progress-icon">{item.icon}</div>
                <div className="progress-label">{item.label}</div>
                <div className={`progress-value text-${item.color}`}>
                  {item.current}
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
        {/* 내 뱃지 */}
        <section className="badge-section card">
          <h3 className="section-title">내 뱃지</h3>
          <div className="badge-grid">
            {badges.map((b, i) => (
              <div
                key={i}
                className={`badge-box ${b.active ? `badge-gradient-${b.gradient}` : 'badge-inactive'}`}
              >
                <div className="badge-emoji">{b.emoji}</div>
                <div className="badge-label">{b.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 실시간 랭킹 */}
        <section className="ranking-section card">
          <h3 className="section-title">실시간 랭킹</h3>
          <div className="ranking-list">
            {rankings.map((r, i) => (
              <div
                key={i}
                className={`ranking-item ranking-bg-${r.color}`}
              >
                <div className="ranking-left">
                  <span className="ranking-emoji">{r.rankEmoji}</span>
                  <div>
                    <div className="ranking-name">{r.name}</div>
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

        {/* Modal */}
        {modalVisible && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{modalTitle}</h2>
                <button className="modal-close" onClick={closeModal}>
                  ×
                </button>
              </div>
              <div className="modal-body">{modalContent}</div>
            </div>
          </div>
        )}
      </main>
      <Footer/>
    </div>
    </>
  );
}

export default Main;
