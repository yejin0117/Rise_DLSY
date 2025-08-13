import React, { useState, useEffect } from 'react';
import BadgeModal from '../BadgeModal/BadgeModal';
import fairEyes from '../../assets/badges/fairEyes.png';
import master from '../../assets/badges/마스터.png';
import newbe from '../../assets/badges/뉴비_백.png';
import crown from '../../assets/badges/왕관.png';
import perfect from '../../assets/badges/정확도왕.png';
import factChecker from '../../assets/badges/팩트체커_백.png';

const GameComponent = () => {
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);
  const [testScore, setTestScore] = useState(0);
  const [testAccuracy, setTestAccuracy] = useState(0);

  // 게임이 끝났을 때 호출되는 함수
  const handleGameEnd = (score, accuracy) => {
    console.log('handleGameEnd called with score:', score, 'accuracy:', accuracy);
    const newBadge = checkEarnedBadge(score, accuracy);
    
    if (newBadge) {
      console.log('Earned new badge:', newBadge);
      setEarnedBadge(newBadge);
      setShowBadgeModal(true);
    }
  };

  // 뱃지 획득 조건 체크 함수
  const checkEarnedBadge = (score, accuracy) => {
    console.log('Checking badge for score:', score, 'accuracy:', accuracy);
    
    // 최고 점수 달성
    if (score >= 100) {
      return {
        name: "타자 마스터",
        image: master,
        description: "100점 이상 획득! 최고의 타자 실력을 보여주셨습니다!"
      };
    }
    // 높은 정확도 달성
    if (accuracy >= 95) {
      return {
        name: "정확도왕",
        image: perfect,
        description: "95% 이상의 정확도를 달성했습니다!"
      };
    }
    // 중급 레벨
    if (score >= 70) {
      return {
        name: "팩트체커",
        image: factChecker,
        description: "70점 이상 획득! 실력이 수준급입니다!"
      };
    }
    // 중하급 레벨
    if (score >= 50) {
      return {
        name: "공정한 눈",
        image: fairEyes,
        description: "50점 이상 획득! 착실히 성장하고 있습니다!"
      };
    }
    // 초보자
    if (score >= 30) {
      return {
        name: "뉴비",
        image: newbe,
        description: "30점 이상 획득! 타자 연습의 첫 걸음을 내딛었습니다!"
      };
    }
    // 특별 업적
    if (score >= 90 && accuracy >= 90) {
      return {
        name: "문해력왕",
        image: crown,
        description: "높은 점수와 정확도를 동시에 달성했습니다! 대단합니다!"
      };
    }
    return null;
  };

  // 테스트용 입력 핸들러
  const handleScoreChange = (e) => {
    setTestScore(Number(e.target.value));
  };

  const handleAccuracyChange = (e) => {
    setTestAccuracy(Number(e.target.value));
  };

  // 테스트 실행 핸들러
  const runTest = () => {
    handleGameEnd(testScore, testAccuracy);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>뱃지 테스트</h2>
      
      {/* 테스트용 입력 폼 */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            점수 (0-100):
            <input
              type="number"
              min="0"
              max="100"
              value={testScore}
              onChange={handleScoreChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>
            정확도 (0-100):
            <input
              type="number"
              min="0"
              max="100"
              value={testAccuracy}
              onChange={handleAccuracyChange}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        
        <button onClick={runTest}>
          테스트 실행
        </button>
      </div>

      {/* 뱃지 모달 */}
      <BadgeModal
        isOpen={showBadgeModal}
        onClose={() => setShowBadgeModal(false)}
        earnedBadge={earnedBadge}
      />

      {/* 현재 상태 표시 */}
      <div style={{ marginTop: '20px' }}>
        <h3>현재 상태:</h3>
        <p>모달 표시 여부: {showBadgeModal ? '표시 중' : '숨김'}</p>
        <p>획득한 뱃지: {earnedBadge ? earnedBadge.name : '없음'}</p>
      </div>
    </div>
  );
};

export default GameComponent;
