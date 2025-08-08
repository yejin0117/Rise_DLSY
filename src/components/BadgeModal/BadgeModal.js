import React, { useState, useEffect } from 'react';
import Badge from '../Badge/Badge';
import './BadgeModal.css';

const BadgeModal = ({ isOpen, onClose, earnedBadge }) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  if (!showModal || !earnedBadge) return null;

  return (
    <div className="badge-modal-overlay">
      <div className="badge-modal">
        <div className="badge-modal-content">
          <div className="badge-modal-header">
            <h2>🎉 새로운 뱃지 획득!</h2>
            <button className="close-button" onClick={onClose}>&times;</button>
          </div>
          
          <div className="badge-showcase">
            <Badge
              name={earnedBadge.name}
              image={earnedBadge.image}
              isNewlyEarned={true}
            />
          </div>
          
          <div className="badge-description">
            <p>{earnedBadge.description}</p>
          </div>

          <button className="continue-button" onClick={onClose}>
            계속하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadgeModal;
