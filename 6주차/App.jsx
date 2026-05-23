import { useState } from 'react';
import './App.css';
import { useMembers } from './hooks/useMembers';
import { useFilter } from './hooks/useFilter';

const PART_COLORS = {
  Frontend: '#1a73e8',
  Backend: '#e8811a',
  Design: '#7b1ae8',
};

function MemberCard({ member, onClick }) {
  const imgSrc = member.picture || `https://picsum.photos/seed/${member.id}/400/280`;
  return (
    <div
      className={`member-card${member.isMine ? ' mine' : ''}`}
      onClick={() => onClick(member)}
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

function DetailPage({ member, onBack }) {
  return (
    <div className="detail-page">
      <button className="back-btn" onClick={onBack}> 목록으로</button>
      <div className="detail-card">
        <h1>{member.name}</h1>
        <div className="detail-part" style={{ color: PART_COLORS[member.part] }}>
          {member.part}
        </div>
        <div className="detail-track">LION TRACK</div>

        <section className="detail-section">
          <h2>자기소개</h2>
          <p>{member.bio}</p>
        </section>

        {(member.email || member.phone || member.website) && (
          <section className="detail-section">
            <h2>연락처</h2>
            <ul>
              {member.email && <li>Email: {member.email}</li>}
              {member.phone && <li>Phone: {member.phone}</li>}
              {member.website && (
                <li>
                  <a href={member.website} target="_blank" rel="noreferrer">
                    {member.website}
                  </a>
                </li>
              )}
            </ul>
          </section>
        )}

        {member.skills.length > 0 && (
          <section className="detail-section">
            <h2>관심 기술</h2>
            <ul>
              {member.skills.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
        )}

        {member.quote && (
          <section className="detail-section">
            <h2>한 마디</h2>
            <p>{member.quote}</p>
          </section>
        )}
      </div>
    </div>
  );
}

function App() {
  // Custom Hook: 멤버 데이터 관련 상태와 로직을 한 곳에서 가져옴
  const { members, loading, formData, setFormData, addRandom, removeLast, handleFormSubmit, refresh } = useMembers();

  // Custom Hook: 필터/정렬/검색 상태와 최종 표시 목록을 한 곳에서 가져옴
  const { filterPart, setFilterPart, sortBy, setSortBy, searchName, setSearchName, displayed } = useFilter(members);

  // UI 상태: 화면 전환, 폼 열기/닫기 → App에서 직접 관리
  const [selectedMember, setSelectedMember] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const onFormSubmit = (e) => {
    handleFormSubmit(e); // 멤버 추가 로직은 useMembers가 담당
    setShowForm(false);  // 폼 닫기는 App이 담당 (UI 상태)
  };

  if (selectedMember) {
    return <DetailPage member={selectedMember} onBack={() => setSelectedMember(null)} />;
  }

  return (
    <div className="app">
      <div className="controls">
        <button onClick={() => setShowForm(!showForm)}>아기 사자 추가</button>
        <button onClick={removeLast}>마지막 아기 사자 삭제</button>
        <span className="count">총 <strong>{members.length}</strong>명</span>
      </div>

      <div className="controls">
        <button onClick={() => addRandom(1)} disabled={loading}>랜덤 1명 추가</button>
        <button onClick={() => addRandom(5)} disabled={loading}>랜덤 5명 추가</button>
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
          <MemberCard key={member.id} member={member} onClick={setSelectedMember} />
        ))}
      </div>
    </div>
  );
}

export default App;
