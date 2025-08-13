import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SignUp.css';


import SearchModal from './SearchModal'; 

const SERVER_API = process.env.REACT_APP_SERVER_API_URL;

function SignUp() {
  const navigate = useNavigate();
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gradeOptions, setGradeOptions] = useState([]);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    school: '',
    grade: '',
    location: '',
  });

  useEffect(() => {
    if (selectedSchool) {
      if (selectedSchool.SCHUL_NM.includes('초등학교')) {
        setGradeOptions(['1학년', '2학년', '3학년', '4학년', '5학년', '6학년']);
      } else if (selectedSchool.SCHUL_NM.includes('중학교')) {
        setGradeOptions(['1학년', '2학년', '3학년']);
      } else if (selectedSchool.SCHUL_NM.includes('고등학교')) {
        setGradeOptions(['1학년', '2학년', '3학년']);
      } else {
        setGradeOptions(['1학년', '2학년', '3학년']);
      }
      setFormData(prev => ({
        ...prev,
        grade: ''
      }));
    }
  }, [selectedSchool]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => {
      const newState = {
        ...prevState,
        [name]: value
      };
      console.log('FormData updated:', newState);
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = '이름을 입력해주세요';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
    }

    if (!formData.school) {
      newErrors.school = '학교를 선택해주세요';
    }

    if (!formData.grade) {
      newErrors.grade = '학년을 선택해주세요';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      console.log('Submitting form data:', formData);
      const response = await fetch(`${SERVER_API}/api/auth/signup`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('🎉회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
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
      
      <div className="signup-container">
        <div className="signup-box">
          <button className="close-button" onClick={() => navigate('/')}>×</button>
          <div className="signup-header">
            <h1>회원가입</h1>
            <p>디지털 문해력 챌린지에 오신 것을 환영합니다!</p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {isSuccess && <div className="success-message">회원가입이 완료되었습니다!</div>}

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
              {errors.username && <span className="error-message">{errors.username}</span>}
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
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="school">학교</label>
              <div className="school-select">
                <input
                  type="text"
                  readOnly
                  value={formData.school || ''}
                  placeholder="학교를 선택하세요"
                  onClick={() => setIsModalOpen(true)}
                />
                <button 
                  type="button" 
                  className="school-search-button"
                  onClick={() => setIsModalOpen(true)}
                >
                  학교 검색
                </button>
              </div>
              {errors.school && <span className="error-message">{errors.school}</span>}
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
                {gradeOptions.map((grade, index) => (
                  <option key={index} value={grade}>{grade}</option>
                ))}
              </select>
              {errors.grade && <span className="error-message">{errors.grade}</span>}
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
              {errors.password && <span className="error-message">{errors.password}</span>}
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
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="signup-button">회원가입</button>
          </form>

          <div className="login-link">
            이미 계정이 있으신가요? <Link to="/login">로그인하기</Link>
          </div>
        </div>
        <SearchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          setSelectedSchool={setSelectedSchool}
          formData={formData}
          setFormData={setFormData}
        />
      </div>
      
    </>
  );
}

export default SignUp;
