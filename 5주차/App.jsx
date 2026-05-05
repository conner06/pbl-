import { useState, useCallback } from 'react'
import './App.css'
import kuromImg from './assets/쿠로미.png'

const PARTS = ['Frontend', 'Backend', 'Design'];

const BADGES = {
  Frontend: ['React', 'TypeScript', 'Vue', 'Next.js'],
  Backend: ['Spring', 'Node.js', 'Django', 'Express'],
  Design: ['Figma', 'Design System', 'Sketch', 'Adobe XD'],
};

const PART_COLORS = {
  Frontend: '#1a73e8',
  Backend: '#e8811a',
  Design: '#7b1ae8',
};

let nextId = 2;

const initialMembers = [
  {
    id: 1,
    name: '민규',
    part: 'Frontend',
    intro: '잘 부탁드립니다.',
    email: 'conner06conner@gmail.com',
    phone: '010-5095-6985',
    skills: ['HTML / CSS', 'JavaScript', 'React'],
    picture: kuromImg,
  },
];

async function fetchRandomUsers(count) {
  const res = await fetch(`https://randomuser.me/api/?results=${count}&nat=us,gb,ca,au,nz`);
  const data = await res.json();
  return data.results.map((u) => {
    const part = PARTS[Math.floor(Math.random() * PARTS.length)];
    const badges = BADGES[part];
    const badge = badges[Math.floor(Math.random() * badges.length)];
    const id = nextId++;
    return {
      id,
      name: `${u.name.first} ${u.name.last}`,
      part,
      intro: `${u.location.city}, ${u.location.country}`,
      bio: `${u.location.city} ${part} 활동하고 있습니다.`,
      email: u.email,
      phone: u.phone,
      picture: u.picture.large,
    };
  });
}

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
  const [members, setMembers] = useState(initialMembers);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterPart, setFilterPart] = useState('전체');
  const [sortBy, setSortBy] = useState('latest');
  const [searchName, setSearchName] = useState('');
  const [formData, setFormData] = useState({ name: '', part: 'Frontend', intro: '' });
  const [loading, setLoading] = useState(false);

  const addRandom = useCallback(async (count) => {
    setLoading(true);
    const newMembers = await fetchRandomUsers(count);
    setMembers((prev) => [...prev, ...newMembers]);
    setLoading(false);
  }, []);

  const removeLast = () => {
    setMembers((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const badge = BADGES[formData.part][0];
    const id = nextId++;
    const newMember = {
      id,
      name: formData.name,
      part: formData.part,
      intro: formData.intro || '아직 소개가 없습니다.',
      bio: formData.intro || '아직 소개가 없습니다.',
      email: '',
      phone: '',
      website: '',
      skills: [],
      quote: '',
      badge,
      picture: `https://picsum.photos/seed/${id}/400/280`,
      isMine: false,
    };
    setMembers((prev) => [...prev, newMember]);
    setFormData({ name: '', part: 'Frontend', intro: '' });
    setShowForm(false);
  };

  let displayed = members.filter((m) => {
    if (filterPart !== '전체' && m.part !== filterPart) return false;
    if (searchName && !m.name.toLowerCase().includes(searchName.toLowerCase())) return false;
    return true;
  });

  if (sortBy === 'part') {
    displayed = [...displayed].sort((a, b) => a.part.localeCompare(b.part));
  }

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
        <button onClick={() => setMembers([...members])}>전체 새로고침</button>
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
        <form className="add-form" onSubmit={handleFormSubmit}>
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

export default App
