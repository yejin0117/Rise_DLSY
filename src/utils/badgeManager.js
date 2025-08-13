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
    description: "뉴스 요약 게임에서 75점 이상 달성한 뉴스 마스터!",
    condition: "뉴스 요약 게임에서 75점 이상 달성",
    gradient: "gold"
  },
  ACCURACY_KING: {
    name: "정확도왕",
    image: accuracyBadge,
    description: "가짜 뉴스 판별의 달인, 정확도 75% 이상!",
    condition: "가짜뉴스 찾기 게임에서 75점 이상 달성",
    gradient: "blue"
  },
  FACT_CHECKER: {
    name: "팩트체커",
    image: factCheckerBadge,
    description: "50점 이상 달성! 뉴스의 진실을 파헤치는 팩트체커!",
    condition: "가짜뉴스 찾기 게임에서 50점 이상 달성",
    gradient: "green"
  },
  FAIR_EYE: {
    name: "공정한 눈",
    image: fairEyeBadge,
    description: " 가짜 뉴스 판별의 달인, 공정한 눈을 가진 당신!",
    condition: "가짜 뉴스 찾기 게임에서 90점 이상 달성",
    gradient: "purple"
  },
  NEWBIE: {
    name: "뉴비",
    image: newbieBadge,
    description: "50점을 넘기셨네요! 이제 시작입니다.",
    condition: "뉴스 요약 게임 50점 이상 달성",
    gradient: "bronze"
  },
  TYPING_KING: {
    name: "문해력 왕",
    image: crownBadge,
    description: "정확한 이해와 빠른 판단으로 정상에 오른 요약 달인",
    condition: "뉴스 요약 게임 90점 이상 달성",
    gradient: "rainbow"
  }
};

// 뱃지 획득 조건 체크 함수
export const checkBadgeAchievement = (gameType, score, accuracy) => {
  const earnedBadges = [];

  switch (gameType) {
    case 'fakeNews':
      // 가짜뉴스 게임 뱃지 조건
      if (score >= 90) earnedBadges.push(BADGES.FAIR_EYE);
      if (score >= 75&&score<90) earnedBadges.push(BADGES.ACCURACY_KING);
      if (score >= 50 && score<75) earnedBadges.push(BADGES.FACT_CHECKER);
      break;

    case 'news':
      // 뉴스 한줄요약 게임 뱃지 조건
      if (score >= 90) earnedBadges.push(BADGES.TYPING_KING);
      if (score >= 75&&score<90) earnedBadges.push(BADGES.TYPING_MASTER);
      if (score >= 50 && score<75) earnedBadges.push(BADGES.NEWBIE);
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
