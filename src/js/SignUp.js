import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SignUp.css';
import Header from './header';
import Footer from './footer';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    school: '',
    grade: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // API 호출 로직 구현
      const response = await // ✅ proxy가 http://localhost:4000 으로 자동 연결해줌
          fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });


      if (response.ok) {
        navigate('/login');
      } else {
        const data = await response.json();
        setError(data.message || '회원가입 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('서버 연결 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <Header/>
    <div className="signup-container">
      <div className="signup-box">
        <button className="close-button" onClick={() => navigate('/')}>×</button>
        <div className="signup-header">
          <h1>회원가입</h1>
          <p>디지털 문해력 챌린지에 오신 것을 환영합니다!</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="username">이름</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="실명을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="이메일을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="school">학교</label>
            <input
              type="text"
              id="school"
              name="school"
              value={formData.school}
              onChange={handleChange}
              required
              placeholder="학교명을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="grade">학년</label>
            <select
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              required
            >
              <option value="">학년을 선택하세요</option>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>

          <button type="submit" className="signup-button">회원가입</button>
        </form>

        <div className="login-link">
          이미 계정이 있으신가요? <Link to="/login">로그인하기</Link>
        </div>
      </div>
    </div>
      <Footer/>
    </>
  );
}

export default SignUp;
