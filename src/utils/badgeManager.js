// 뱃지 이미지 import
import masterBadge from '../assets/badges/마스터.png';
import accuracyBadge from '../assets/badges/정확도왕.png';
import factCheckerBadge from '../assets/badges/팩트체커_백.png';
import fairEyeBadge from '../assets/badges/fairEyes.png'; 
import newbieBadge from '../assets/badges/뉴비_백.png';
import crownBadge from '../assets/badges/왕관.png';

// 뱃지 정의
export const BADGES = {
  TYPING_MASTER: {
    name: "뉴스 마스터",
    image: masterBadge,
    description: "1000점 달성! 모든 게임을 섭렵한 진정한 뉴스 고수!",
    condition: "누적 점수 1,000점 이상 달성",
    gradient: "gold"
  },
  ACCURACY_KING: {
    name: "정확도왕",
    image: accuracyBadge,
    description: "뉴스의 핵심을 정확하게 짚어내는 요약의 달인!",
    condition: "뉴스 한줄요약 게임에서 80점 이상 달성",
    gradient: "blue"
  },
  FACT_CHECKER: {
    name: "팩트체커",
    image: factCheckerBadge,
    description: "가짜 뉴스 판별 실력이 수준급입니다!",
    condition: "가짜뉴스 찾기 게임에서 80점 이상 달성",
    gradient: "green"
  },
  FAIR_EYE: {
    name: "공정한 눈",
    image: fairEyeBadge,
    description: " 순위는 낮아도 세상을 바라보는 눈은 공정하고 날카로운 당신에게 주어지는 위로의 뱃지입니다.",
    condition: "랭킹 최하위 달성",
    gradient: "purple"
  },
  NEWBIE: {
    name: "뉴비",
    image: newbieBadge,
    description: "어서오세요! 첫 발을 내딛은 초심자!",
    condition: "첫 게임 플레이",
    gradient: "bronze"
  },
  TYPING_KING: {
    name: "문해력 왕",
    image: crownBadge,
    description: "정확한 이해와 빠른 판단으로 정상에 오른 최고의 독해력 챔피언",
    condition: "랭킹 1위 달성",
    gradient: "rainbow"
  }
};

// 뱃지 획득 조건 체크 함수
export const checkBadgeAchievement = (gameType, score, accuracy) => {
  const earnedBadges = [];

  switch (gameType) {
    case 'typing':
      // 타자 게임 뱃지 조건
      if (score >= 100) earnedBadges.push(BADGES.TYPING_MASTER);
      if (accuracy >= 95) earnedBadges.push(BADGES.ACCURACY_KING);
      if (score >= 90 && accuracy >= 90) earnedBadges.push(BADGES.TYPING_KING);
      if (score >= 70) earnedBadges.push(BADGES.FACT_CHECKER);
      if (score >= 50) earnedBadges.push(BADGES.FAIR_EYE);
      if (score >= 30) earnedBadges.push(BADGES.NEWBIE);
      break;

    case 'fakeNews':
      // 가짜뉴스 게임 뱃지 조건
      if (score === 100) earnedBadges.push(BADGES.FAIR_EYE);
      if (score >= 75) earnedBadges.push(BADGES.ACCURACY_KING);
      if (score >= 50) earnedBadges.push(BADGES.FACT_CHECKER);
      break;

    default:
      console.warn('Unknown game type:', gameType);
  }

  return earnedBadges;
};

// 사용자의 뱃지 저장 함수
export const saveBadges = (newBadges) => {
  try {
    // 기존 뱃지 불러오기
    const existingBadges = JSON.parse(localStorage.getItem('earnedBadges') || '[]');
    
    // 중복 제거하며 새 뱃지 추가
    const updatedBadges = [...existingBadges];
    newBadges.forEach(newBadge => {
      if (!existingBadges.some(badge => badge.name === newBadge.name)) {
        updatedBadges.push({
          ...newBadge,
          earnedAt: new Date().toISOString(),
          active: true
        });
      }
    });

    // 저장
    localStorage.setItem('earnedBadges', JSON.stringify(updatedBadges));
    return updatedBadges;
  } catch (error) {
    console.error('Failed to save badges:', error);
    return null;
  }
};

// 사용자의 뱃지 불러오기 함수
export const loadBadges = () => {
  try {
    return JSON.parse(localStorage.getItem('earnedBadges') || '[]');
  } catch (error) {
    console.error('Failed to load badges:', error);
    return [];
  }
};

// 뱃지 활성화/비활성화 함수
export const toggleBadgeActive = (badgeName) => {
  try {
    const badges = loadBadges();
    const updatedBadges = badges.map(badge => {
      if (badge.name === badgeName) {
        return { ...badge, active: !badge.active };
      }
      return badge;
    });
    localStorage.setItem('earnedBadges', JSON.stringify(updatedBadges));
    return updatedBadges;
  } catch (error) {
    console.error('Failed to toggle badge:', error);
    return null;
  }
};
