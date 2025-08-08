import React from "react";
import "./BadgesPage.css"; // 스타일은 아래에 첨부

function BadgesPage({ badge, onClose }) {
  if (!badge) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <img
          src={`/images/badges/${badge.name}.png`}
          alt={badge.name}
          className="badge-image"
        />
        <h2 className="badge-title">🎉 새 뱃지 획득!</h2>
        <h3 className="badge-name">{badge.name}</h3>
        <p className="badge-description">{badge.description}</p>
        <button className="close-button" onClick={onClose}>확인</button>
      </div>
    </div>
  );
}

export default BadgesPage;