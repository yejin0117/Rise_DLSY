import React, { useState } from 'react';
import axios from 'axios';
import '../css/SearchModal.css';

const NEIS_API_URL = 'https://open.neis.go.kr/hub/schoolInfo';
const API_KEY = '8b52c382fe364e15ba5d418c8680cce6';

const SearchModal = ({ isOpen, onClose, setSelectedSchool, formData, setFormData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('B10');
  const [selectedType, setSelectedType] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const Location_CODES = {
    'B10': '서울특별시',
    'C10': '부산광역시',
    'D10': '대구광역시',
    'E10': '인천광역시',
    'F10': '광주광역시',
    'G10': '대전광역시',
    'H10': '울산광역시',
    'I10': '세종특별자치시',
    'J10': '경기도',
    'K10': '강원도',
    'M10': '충청북도',
    'N10': '충청남도',
    'P10': '전라북도',
    'Q10': '전라남도',
    'R10': '경상북도',
    'S10': '경상남도',
    'T10': '제주특별자치도'
  };

  const SCHOOL_TYPES = ['초등학교', '중학교', '고등학교', '특수학교'];

  const searchSchools = async () => {
    setLoading(true);
    try {
      let queryParams = new URLSearchParams({
        KEY: API_KEY,
        Type: 'json',
        pIndex: 1,
        pSize: 100
      });

      if (searchTerm) {
        queryParams.append('SCHUL_NM', searchTerm);
      }

      if (selectedLocation) {
        queryParams.append('ATPT_OFCDC_SC_CODE', selectedLocation);
      }

      if (selectedType) {
        queryParams.append('SCHUL_KND_SC_NM', selectedType);
      }

      const response = await axios.get(`${NEIS_API_URL}?${queryParams}`);
      
      if (!response.data.RESULT && response.data.schoolInfo) {
        const [, schoolList] = response.data.schoolInfo;
        setSearchResults(schoolList.row);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Error fetching schools:', err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e.type === 'click' || e.key === 'Enter') {
      searchSchools();
    }
  };

  const handleSelectSchool = (school) => {
    setSelectedSchool(school);
    setFormData(prev => {
      const newData = {
        ...prev,
        school: school.SCHUL_NM,
        location: Location_CODES[selectedLocation]
      };
      console.log('School selected:', {
        schoolName: school.SCHUL_NM,
        location: Location_CODES[selectedLocation],
        fullFormData: newData
      });
      return newData;
    });
    onClose();
  };

  const handleLocationChange = (e) => {
    const locationCode = e.target.value;
    setSelectedLocation(locationCode);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>학교 검색</h2>
        <div className="search-container">
          <select
            value={selectedLocation}
            onChange={handleLocationChange}
            className="search-select"
          >
            <option value="">지역 선택</option>
            {Object.entries(Location_CODES).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="search-select"
          >
            <option value="">학교급 선택</option>
            {SCHOOL_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="학교 이름으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e);
              }
            }}
            className="search-input"
          />
          
          <button onClick={handleSearch} className="search-button">
            검색
          </button>
        </div>

        <div className="search-results">
          {loading ? (
            <div className="loading">검색 중...</div>
          ) : (
            <div className="results-list">
              {searchResults.length > 0 ? (
                <>
                  <p className="results-count">검색결과: {searchResults.length}개의 학교</p>
                  {searchResults.map((school) => (
                    <div 
                      key={school.SD_SCHUL_CODE} 
                      className="result-item"
                      onClick={() => handleSelectSchool(school)}
                    >
                      <h4>{school.SCHUL_NM}</h4>
                      <p>{school.ORG_RDNMA}</p>
                      <p>{school.SCHUL_KND_SC_NM}</p>
                    </div>
                  ))}
                </>
              ) : (
                searchTerm && <div className="no-results">검색 결과가 없습니다.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
