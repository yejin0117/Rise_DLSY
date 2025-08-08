v
import React, { useState } from 'react';
import BadgeModal from '../components/BadgeModal/BadgeModal';

const GameComponent = () => {
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);

  // 게임이 끝났을 때 호출되는 함수
  const handleGameEnd = (score) => {
    // 점수나 조건에 따라 획득한 뱃지 결정
    const newBadge = checkEarnedBadge(score);
    
    if (newBadge) {
      setEarnedBadge(newBadge);
      setShowBadgeModal(true);
    }
  };

  // 뱃지 획득 조건 체크 함수
  const checkEarnedBadge = (score) => {
    // 예시: 점수에 따른 뱃지 부여
    if (score >= 100) {
      return {
        name: "타자 마스터",
        image: "/badges/typing-master.png",
        description: "100점 이상 획득! 타자 실력이 대단합니다!"
      };
    }
    // 더 많은 뱃지 조건 추가 가능
    return null;
  };

  return (
    <div>
      {/* 게임 컨텐츠 */}
      
      {/* 뱃지 모달 */}
      <BadgeModal
        isOpen={showBadgeModal}
        onClose={() => setShowBadgeModal(false)}
        earnedBadge={earnedBadge}
      />
    </div>
  );
};

export default GameComponent;