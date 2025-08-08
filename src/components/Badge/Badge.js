import React, { useState, useEffect } from 'react';
import './Badge.css';

const Badge = ({ name, image, isNewlyEarned }) => {
  const [showAnimation, setShowAnimation] = useState(isNewlyEarned);

  useEffect(() => {
    if (isNewlyEarned) {
      // 뱃지 획득 시 효과음 재생
      const sound = new Audio('/sounds/badge-earned.mp3');
      sound.play().catch(err => console.log('Sound play failed:', err));
      
      // 3초 후 애니메이션 효과 제거
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isNewlyEarned]);

  return (
    <div className={`badge ${showAnimation ? 'badge-earned' : ''}`}>
      <div className="badge-image">
        <img src={image} alt={`${name} 뱃지`} />
      </div>
      <div className="badge-info">
        <h3>{name}</h3>
      </div>
      {showAnimation && (
        <div className="badge-notification">
          🎉 새로운 뱃지를 획득했습니다!
        </div>
      )}
    </div>
  );
};

export default Badge;
