import React from 'react';
import GameComponent from '../components/Badge/GameComponent';
import Header from '../js/header';
import Footer from '../js/footer';

const BadgeTest = () => {
  return (
    <>
      <Header />
      <div style={{ 
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#f5f5f5'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>뱃지 시스템 테스트</h1>
        <GameComponent />
      </div>
      <Footer />
    </>
  );
};

export default BadgeTest;
