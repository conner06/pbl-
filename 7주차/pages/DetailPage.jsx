import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MembersContext } from '../App';

const PART_COLORS = {
  Frontend: '#1a73e8',
  Backend: '#e8811a',
  Design: '#7b1ae8',
};

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { members } = useContext(MembersContext);

  const member = members.find((m) => String(m.id) === id);

  if (!member) {
    return (
      <div className="detail-page">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← 목록으로
        </button>
        <p style={{ textAlign: 'center', marginTop: '40px' }}>멤버를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← 목록으로
      </button>
      <div className="detail-card">
        <h1>{member.name}</h1>
        <div className="detail-part" style={{ color: PART_COLORS[member.part] }}>
          {member.part}
        </div>
        <div className="detail-track">LION TRACK</div>

        <section className="detail-section">
          <h2>자기소개</h2>
          <p>{member.bio || member.intro}</p>
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

        {member.skills && member.skills.length > 0 && (
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
