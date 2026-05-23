import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MembersContext } from '../App';
import { useFilter } from '../hooks/useFilter';

const PART_COLORS = {
  Frontend: '#1a73e8',
  Backend: '#e8811a',
  Design: '#7b1ae8',
};

function MemberCard({ member }) {
  const navigate = useNavigate();
  const imgSrc = member.picture || `https://picsum.photos/seed/${member.id}/400/280`;

  return (
    <div
      className={`member-card${member.isMine ? ' mine' : ''}`}
      onClick={() => navigate(`/lions/${member.id}`)}
    >
      <div className="card-image">
        <img src={imgSrc} alt={member.name} />
        <span className="card-badge">{member.badge}</span>
      </div>
      <div className="card-info">
        <h3>{member.name}</h3>
        <div className="card-part" style={{ color: PART_COLORS[member.part] }}>
          {member.part}
        </div>
        <p>{member.intro}</p>
      </div>
    </div>
  );
}

export default function ListPage() {
  const {
    members,
    loading,
    formData,
    setFormData,
    addRandom,
    removeLast,
    handleFormSubmit,
    refresh,
  } = useContext(MembersContext);

  const { filterPart, setFilterPart, sortBy, setSortBy, searchName, setSearchName, displayed } =
    useFilter(members);

  const [showForm, setShowForm] = useState(false);

  const onFormSubmit = (e) => {
    handleFormSubmit(e);
    setShowForm(false);
  };

  return (
    <div className="app">
      <div className="controls">
        <button onClick={() => setShowForm(!showForm)}>아기 사자 추가</button>
        <button onClick={removeLast}>마지막 아기 사자 삭제</button>
        <span className="count">
          총 <strong>{members.length}</strong>명
        </span>
      </div>

      <div className="controls">
        <button onClick={() => addRandom(1)} disabled={loading}>
          랜덤 1명 추가
        </button>
        <button onClick={() => addRandom(5)} disabled={loading}>
          랜덤 5명 추가
        </button>
        <button onClick={refresh}>전체 새로고침</button>
        <button className="ready-btn">준비 완료</button>
      </div>

      <div className="filter-row">
        <label>
          파트
          <select value={filterPart} onChange={(e) => setFilterPart(e.target.value)}>
            <option>전체</option>
            <option>Frontend</option>
            <option>Backend</option>
            <option>Design</option>
          </select>
        </label>
        <label>
          정렬
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="latest">최신추가순</option>
            <option value="part">파트순</option>
          </select>
        </label>
        <label>
          검색
          <input
            placeholder="이름으로 검색"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </label>
      </div>

      {showForm && (
        <form className="add-form" onSubmit={onFormSubmit}>
          <label>
            이름
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="이름 입력"
              required
            />
          </label>
          <label>
            파트
            <select
              value={formData.part}
              onChange={(e) => setFormData({ ...formData, part: e.target.value })}
            >
              <option>Frontend</option>
              <option>Backend</option>
              <option>Design</option>
            </select>
          </label>
          <label>
            소개
            <input
              value={formData.intro}
              onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
              placeholder="한 줄 소개 입력"
            />
          </label>
          <button type="submit">추가</button>
        </form>
      )}

      <div className="card-grid">
        {displayed.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
