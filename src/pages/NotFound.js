import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '8rem',
        margin: '0',
        color: '#333'
      }}>404</h1>
      <h2 style={{
        fontSize: '2rem',
        margin: '20px 0',
        color: '#666'
      }}>페이지를 찾을 수 없습니다</h2>
      <p style={{
        fontSize: '1.2rem',
        color: '#888',
        marginBottom: '30px'
      }}>
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <Link to="/" style={{
        textDecoration: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '5px',
        fontSize: '1.1rem',
        transition: 'background-color 0.3s'
      }}>
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFound;
